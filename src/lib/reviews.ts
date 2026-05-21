/**
 * Product reviews — Google Sheets backed (matches the catalogue/orders architecture).
 *
 * Sheet tab "Reviews" with header row 1:
 *   A: Timestamp | B: Product Key | C: Name | D: Rating | E: Title | F: Body | G: Status
 *
 * Only rows with Status === "Approved" are ever shown publicly. Submissions are
 * appended with Status "Pending" and must be approved in the sheet by hand —
 * this keeps spam and fake ratings out of the live AggregateRating schema.
 *
 * Everything degrades gracefully to empty when the tab or credentials are absent,
 * so the storefront works the same whether or not reviews have been set up yet.
 */
import { google } from "googleapis";

const SHEET_NAME = "Reviews";

export interface Review {
  productKey: string;
  name: string;
  rating: number; // 1..5
  title: string;
  body: string;
  date: string; // ISO
}

export interface ReviewSummary {
  count: number;
  average: number; // rounded to 1 dp
}

/**
 * Stable per-product review key derived from a variant slug: strips the
 * pack-size suffix so all pack sizes of one product share their reviews.
 * e.g. "ashwagandha-churna-200g" → "ashwagandha-churna".
 */
export function toReviewKey(slug: string): string {
  return slug.replace(/-\d+(?:\.\d+)?(?:g|gm|kg|ml|l|cap|caps|tabs|tab)$/i, "");
}

function getSheets() {
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

/** All approved reviews for a product key, newest first. */
export async function getReviewsForProduct(productKey: string): Promise<Review[]> {
  const client = getSheets();
  if (!client) return [];
  try {
    const res = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range: `${SHEET_NAME}!A2:G`,
    });
    const rows = res.data.values ?? [];
    return rows
      .filter((r) => String(r[1]).trim() === productKey && String(r[6]).trim().toLowerCase() === "approved")
      .map((r) => ({
        date: String(r[0] ?? ""),
        productKey: String(r[1] ?? ""),
        name: String(r[2] ?? "Anonymous"),
        rating: Math.max(1, Math.min(5, Math.round(Number(r[3]) || 0))),
        title: String(r[4] ?? ""),
        body: String(r[5] ?? ""),
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (err) {
    console.error("[reviews] read failed (non-fatal):", err);
    return [];
  }
}

export function summarise(reviews: Review[]): ReviewSummary {
  if (reviews.length === 0) return { count: 0, average: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { count: reviews.length, average: Math.round((sum / reviews.length) * 10) / 10 };
}

/** Append a pending review. Returns false if storage is unavailable. */
export async function addReview(input: {
  productKey: string;
  name: string;
  rating: number;
  title: string;
  body: string;
}): Promise<boolean> {
  const client = getSheets();
  if (!client) return false;
  const row = [
    new Date().toISOString(),
    input.productKey,
    input.name,
    String(Math.max(1, Math.min(5, Math.round(input.rating)))),
    input.title,
    input.body,
    "Pending",
  ];
  await client.sheets.spreadsheets.values.append({
    spreadsheetId: client.spreadsheetId,
    range: `${SHEET_NAME}!A:G`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
  return true;
}
