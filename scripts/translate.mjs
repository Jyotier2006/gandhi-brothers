/**
 * Build-time translation helper.
 *
 * Reads messages/en.json and fills messages/hi.json and messages/gu.json using
 * the free MyMemory API (no key required). Output is static JSON that ships with
 * the site — translation happens once, here, not at runtime.
 *
 * Usage:
 *   node scripts/translate.mjs            # translate only MISSING keys (keeps hand edits)
 *   node scripts/translate.mjs --all      # re-translate everything (overwrites)
 *
 * Optional: set MYMEMORY_EMAIL in the environment to raise the free daily quota
 * (anonymous ≈ 5k words/day; with email ≈ 50k words/day).
 *
 * NOTE: machine translation is a DRAFT. Have a native speaker review the output
 * before it goes live — especially legal and medical/Ayurvedic copy.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { translateText, usingGoogle } from "./translate-core.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "messages");
const SOURCE = "en";
const TARGETS = ["hi", "gu"];
const FORCE = process.argv.includes("--all");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Recursively walk the source object, translating string leaves. */
async function translateTree(src, existing, target, prefix = "") {
  const result = Array.isArray(src) ? [] : {};
  for (const [key, value] of Object.entries(src)) {
    const keyPath = prefix ? `${prefix}.${key}` : key;
    const prev = existing?.[key];

    if (value && typeof value === "object") {
      result[key] = await translateTree(value, prev, target, keyPath);
    } else if (typeof value === "string") {
      if (!FORCE && typeof prev === "string" && prev.trim()) {
        result[key] = prev; // keep existing (hand-written) translation
        continue;
      }
      try {
        result[key] = await translateText(value, target);
        process.stdout.write(`  ✓ ${target}: ${keyPath}\n`);
        await sleep(usingGoogle ? 60 : 300);
      } catch (err) {
        result[key] = prev ?? value; // fall back to existing or English
        process.stdout.write(`  ⚠ ${target}: ${keyPath} — ${err.message} (kept fallback)\n`);
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

async function main() {
  console.log(`Provider: ${usingGoogle ? "Google Cloud Translation" : "MyMemory (free)"}`);
  const en = JSON.parse(await readFile(path.join(MESSAGES_DIR, `${SOURCE}.json`), "utf8"));

  for (const target of TARGETS) {
    let existing = {};
    try {
      existing = JSON.parse(await readFile(path.join(MESSAGES_DIR, `${target}.json`), "utf8"));
    } catch {
      /* no existing file yet */
    }
    console.log(`\nTranslating → ${target}${FORCE ? " (all)" : " (missing only)"}…`);
    const translated = await translateTree(en, existing, target);
    await writeFile(
      path.join(MESSAGES_DIR, `${target}.json`),
      JSON.stringify(translated, null, 2) + "\n",
      "utf8"
    );
    console.log(`Wrote messages/${target}.json`);
  }

  console.log("\nDone. ⚠ Machine-translated — please have a native speaker review before publishing.");
}

main().catch((err) => {
  console.error("translate.mjs failed:", err);
  process.exit(1);
});
