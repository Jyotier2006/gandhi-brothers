/**
 * Stock decrement + audit log writes.
 *
 * Called from /api/razorpay/verify-payment after successful payment, BEFORE
 * the order is recorded in the Orders sheet.
 */
import { google } from 'googleapis';
import { invalidateProductCache } from './products';

const PRODUCTS_SHEET = 'Products';
const MOVEMENTS_SHEET = 'Stock Movements';

function getSheetsClient() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) {
    throw new Error('Google Sheets credentials not configured');
  }
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

type StockChange = {
  skuCode: string;
  productName: string;   // for audit log
  packSize: string;      // for audit log
  quantity: number;      // positive integer to decrement
  reason: string;        // e.g. "Order GB123..."
};

/**
 * Decrement stock for a list of SKUs and write audit rows.
 *
 * Strategy: batch read the current stock for all affected SKUs, compute new
 * values, batch update. Then append audit rows in one call.
 */
export async function applyStockChanges(changes: StockChange[]): Promise<void> {
  if (changes.length === 0) return;

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');

  const sheets = getSheetsClient();

  // 1. Read entire Products sheet so we can find rows by SKU code.
  const productsRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${PRODUCTS_SHEET}!A4:I`,  // SKU through Stock columns
  });
  const rows = productsRes.data.values ?? [];

  // 2. Build SKU → row index map (1-indexed for Sheets API: header was on row 3,
  //    so first data row is row 4 → index 0 in our slice maps to row 4).
  const updates: { range: string; values: any[][] }[] = [];
  const auditRows: any[][] = [];
  const now = new Date().toISOString();

  for (const change of changes) {
    const idx = rows.findIndex((r) => String(r[0]) === change.skuCode);
    if (idx === -1) {
      console.warn(`Stock change skipped: SKU ${change.skuCode} not found in sheet`);
      continue;
    }
    const sheetRowNum = idx + 4;                      // row 4 = first data row
    const currentStock = Number(rows[idx][8]) || 0;   // column I = Stock
    const newStock = Math.max(0, currentStock - change.quantity);

    // Update column I (Stock) for this row
    updates.push({
      range: `${PRODUCTS_SHEET}!I${sheetRowNum}`,
      values: [[newStock]],
    });

    // Audit log row: Timestamp, SKU, Name, Pack, Change, NewStock, Reason
    auditRows.push([
      now,
      change.skuCode,
      change.productName,
      change.packSize,
      `-${change.quantity}`,
      newStock,
      change.reason,
    ]);
  }

  // 3. Batch-update product stock cells
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: updates,
      },
    });
  }

  // 4. Append audit rows
  if (auditRows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${MOVEMENTS_SHEET}!A:G`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: auditRows },
    });
  }

  // 5. Invalidate the product cache so the next page-load sees fresh stock
  invalidateProductCache();
}
