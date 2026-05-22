/**
 * Best-seller signal, computed from REAL orders in the Google Sheet.
 *
 * Reads the "Orders" tab, parses each order's items cell (column J, written by
 * saveOrderToSheet as `Name ×qty @₹price | Name ×qty @₹price | …`) and tallies
 * total units sold per base product name (pack sizes collapsed).
 *
 * Designed to degrade gracefully: missing credentials, a missing "Orders" tab,
 * or zero orders all return an empty tally — callers then simply show no
 * "Bestseller" badges and fall back to a neutral catalogue order. We never
 * fabricate sales numbers.
 */

import { google } from "googleapis";
import { stripPackSize } from "./utils";

const RANGE = "Orders!A2:M"; // skip header row; A..M covers Items (J) + Total (M)
const ITEMS_COL = 9; // column J (0-indexed within A..M)
const TOTAL_COL = 12; // column M

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min — sales move slowly; spare the Sheets API
let cache: { tally: Map<string, number>; expiresAt: number } | null = null;
let ordersTabMissing = false; // remember a missing tab so we don't retry-spam

function getSheetsClient() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!email || !key || !spreadsheetId) return null;
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId };
}

/** Parse one item cell — `"Triphala Churna (200g) ×2 @₹250"` → `{ base, qty }`. */
function parseItem(itemStr: string): { base: string; qty: number } | null {
  const [namePart, rest] = itemStr.split(" ×");
  if (!namePart) return null;
  const qty = rest ? parseInt(rest.split(" @")[0], 10) : 1;
  return {
    base: stripPackSize(namePart.trim()),
    qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
  };
}

/**
 * Units sold per base product name. Cached for {@link CACHE_TTL_MS}.
 * Returns an empty Map (never throws) when sales data is unavailable.
 */
export async function getSalesTally(): Promise<Map<string, number>> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.tally;
  if (ordersTabMissing) return new Map();

  const client = getSheetsClient();
  if (!client) return new Map();

  const tally = new Map<string, number>();
  try {
    const res = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range: RANGE,
    });
    const rows = res.data.values ?? [];
    for (const row of rows) {
      const itemsText = row[ITEMS_COL];
      // Count a row as a real sale only if it has line items and a positive total.
      const total = Number(row[TOTAL_COL]);
      if (!itemsText || !(total > 0)) continue;

      for (const itemStr of String(itemsText).split(" | ")) {
        const parsed = parseItem(itemStr);
        if (!parsed || !parsed.base) continue;
        tally.set(parsed.base, (tally.get(parsed.base) ?? 0) + parsed.qty);
      }
    }
    cache = { tally, expiresAt: now + CACHE_TTL_MS };
    return tally;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/Unable to parse range|not found/i.test(msg)) {
      ordersTabMissing = true; // tab doesn't exist yet — stop trying
    }
    console.warn("[sales] tally unavailable (non-fatal):", msg);
    return cache?.tally ?? new Map();
  }
}

/**
 * The set of base product names that count as catalogue-wide best sellers:
 * the top `limit` by units sold, restricted to products that have actually
 * sold at least once. Empty when there are no sales.
 */
export async function getBestsellerNames(limit = 8): Promise<Set<string>> {
  const tally = await getSalesTally();
  const ranked = [...tally.entries()]
    .filter(([, units]) => units > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([base]) => base);
  return new Set(ranked);
}

/** Test-only / revalidation hook to clear the cached tally. */
export function invalidateSalesCache() {
  cache = null;
  ordersTabMissing = false;
}
