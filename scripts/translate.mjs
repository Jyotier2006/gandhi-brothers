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

const ROOT = path.resolve(import.meta.dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "messages");
const SOURCE = "en";
const TARGETS = ["hi", "gu"];
const FORCE = process.argv.includes("--all");
const EMAIL = process.env.MYMEMORY_EMAIL || "";

/**
 * Domain glossary — terms machine translation gets wrong (Ayurvedic vocabulary,
 * brand words). When a string matches a key EXACTLY, we use these instead of the
 * API. Add to this as you spot bad translations; correct everywhere on re-run.
 */
const GLOSSARY = {
  Churna: { hi: "चूर्ण", gu: "ચૂર્ણ" },
  Churnas: { hi: "चूर्ण", gu: "ચૂર્ણ" },
  Taila: { hi: "तैल", gu: "તૈલ" },
  Tailas: { hi: "तैल", gu: "તૈલ" },
  Ayurveda: { hi: "आयुर्वेद", gu: "આયુર્વેદ" },
  Ayurvedic: { hi: "आयुर्वेदिक", gu: "આયુર્વેદિક" },
  Junagadh: { hi: "जूनागढ़", gu: "જૂનાગઢ" },
  Category: { hi: "श्रेणी", gu: "શ્રેણી" },
  Apply: { hi: "लागू करें", gu: "લાગુ કરો" },
  "Ayurvedic Churnas": { hi: "आयुर्वेदिक चूर्ण", gu: "આયુર્વેદિક ચૂર્ણ" },
  "Ayurvedic Tailas": { hi: "आयुर्वेदिक तैल", gu: "આયુર્વેદિક તૈલ" },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Protect ICU placeholders like {name} so the API can't translate them. */
function protect(text) {
  const tokens = [];
  const masked = text.replace(/\{[^}]+\}/g, (m) => {
    tokens.push(m);
    return `XPLH${tokens.length - 1}HPLX`;
  });
  return { masked, tokens };
}
function restore(text, tokens) {
  return text.replace(/XPLH(\d+)HPLX/g, (_, i) => tokens[Number(i)] ?? "");
}

async function translateOne(text, target) {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Exact-match domain term → use the curated translation, skip the API.
  const term = GLOSSARY[trimmed];
  if (term && term[target]) return term[target];

  const { masked, tokens } = protect(text);
  const params = new URLSearchParams({ q: masked, langpair: `${SOURCE}|${target}` });
  if (EMAIL) params.set("de", EMAIL);

  const url = `https://api.mymemory.translated.net/get?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const status = data.responseStatus;
  const out = data?.responseData?.translatedText ?? "";
  // MyMemory signals quota/errors via status + a warning string in the payload.
  if (status !== 200 || /MYMEMORY WARNING|INVALID|QUOTA/i.test(out)) {
    throw new Error(out || `status ${status}`);
  }
  return restore(decodeEntities(out), tokens);
}

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
        result[key] = await translateOne(value, target);
        process.stdout.write(`  ✓ ${target}: ${keyPath}\n`);
        await sleep(300); // be polite to the free API
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
