/**
 * Build-time translation of product DESCRIPTION prose into hi/gu.
 *
 * Reads the English descriptions from src/lib/product-descriptions.ts and writes
 * translated prose into messages/descriptions.{hi,gu}.json (keyed by SKU), which
 * getProductDescription(sku, locale) overlays onto the English base.
 *
 * Run (needs the TS loader):  npx -y tsx scripts/translate-descriptions.mts
 *   --all   re-translate everything (default: only missing fields)
 *
 * ⚠ This is medical/Ayurvedic copy. Machine output is a DRAFT and MUST be
 * checked for compliance by a native speaker before it goes live.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { productDescriptions } from "../src/lib/product-descriptions";
// @ts-expect-error — plain JS helper, no types
import { translateText, usingGoogle } from "./translate-core.mjs";

const MESSAGES_DIR = path.resolve(import.meta.dirname, "..", "messages");
const TARGETS = ["hi", "gu"] as const;
const FORCE = process.argv.includes("--all");
const STRING_FIELDS = ["tagline", "whatsInThePack", "howToUse", "cautions", "classification"] as const;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const translateOne = (text: string, target: string): Promise<string> =>
  translateText(text, target);

async function main() {
  for (const target of TARGETS) {
    const file = path.join(MESSAGES_DIR, `descriptions.${target}.json`);
    let existing: Record<string, any> = {};
    try { existing = JSON.parse(await readFile(file, "utf8")); } catch { /* none */ }

    const out: Record<string, any> = { ...existing };
    let translated = 0, failed = 0;

    for (const [sku, desc] of Object.entries(productDescriptions)) {
      const entry: any = { ...(out[sku] ?? {}) };

      for (const field of STRING_FIELDS) {
        if (!FORCE && entry[field]) continue;
        try {
          entry[field] = await translateOne((desc as any)[field], target);
          translated++;
          await sleep(usingGoogle ? 60 : 300);
        } catch (err: any) {
          failed++;
          process.stdout.write(`  ⚠ ${target} ${sku}.${field}: ${err.message}\n`);
        }
      }

      if (FORCE || !entry.intro) {
        const intro: string[] = [];
        for (const para of desc.intro) {
          try {
            intro.push(await translateOne(para, target));
            translated++;
            await sleep(usingGoogle ? 60 : 300);
          } catch (err: any) {
            intro.push(para); // keep English paragraph on failure
            failed++;
            process.stdout.write(`  ⚠ ${target} ${sku}.intro: ${err.message}\n`);
          }
        }
        entry.intro = intro;
      }

      out[sku] = entry;
      process.stdout.write(`  ✓ ${target}: ${sku}\n`);
    }

    await writeFile(file, JSON.stringify(out, null, 2) + "\n", "utf8");
    console.log(`Wrote messages/descriptions.${target}.json (${translated} translated, ${failed} failed)`);
  }
  console.log("\n⚠ Drafts — compliance/native review required before publishing.");
}

main().catch((e) => { console.error(e); process.exit(1); });
