import { google } from "googleapis";
import type { OrderRecord } from "./types";

/**
 * ============================================================================
 * REQUIRED GOOGLE SHEET SETUP:
 * 1. Create a new Google Sheet.
 * 2. Rename the first tab/sheet to exactly: "Orders"
 * 3. Add the following header fields in Row 1 (A through O):
 *    Order ID, Created At, Customer Name, Email, Phone, Address, City, State, 
 *    Pincode, Items, Subtotal, Delivery, Total, Razorpay Order ID, Razorpay Payment ID
 * 4. Create a Google Cloud Project -> APIs & Services -> Enable Google Sheets API.
 * 5. Create Credentials -> Service Account -> Generate JSON key.
 * 6. SHARE the Google Sheet with the Service Account email generated in step 5 
 *    (grant "Editor" permissions).
 * 7. Copy the configuration details to your `.env` file:
 *    GOOGLE_SHEETS_CLIENT_EMAIL="..."
 *    GOOGLE_SHEETS_PRIVATE_KEY="..."
 *    GOOGLE_SHEETS_SPREADSHEET_ID="..."
 * ============================================================================
 */

export async function saveOrderToSheet(order: OrderRecord): Promise<void> {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  // Vercel / JSON formats often escape newlines. We must unescape them for the crypto provider.
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !privateKey || !spreadsheetId) {
    throw new Error("Google Sheets credentials not configured. Please check environment variables.");
  }

  // Authorize with JWT
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Format cart items beautifully for the spreadsheet cell
  const itemsText = order.items
    .map((i) => `${i.name} ×${i.quantity} @₹${i.price}`)
    .join(" | ");

  const rowData = [
    order.id,                   // A: Order ID
    order.createdAt,            // B: Created At
    order.customer.name,        // C: Customer Name
    order.customer.email,       // D: Email
    order.customer.phone,       // E: Phone
    order.customer.address,     // F: Address
    order.customer.city,        // G: City
    order.customer.state,       // H: State
    order.customer.pincode,     // I: Pincode
    itemsText,                  // J: Items Summary
    order.subtotal,             // K: Subtotal
    order.delivery,             // L: Delivery
    order.total,                // M: Total
    order.razorpay_order_id,    // N: Razorpay Order ID
    order.razorpay_payment_id,  // O: Razorpay Payment ID
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Orders!A:O", // Covers exact bounds
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowData],
    },
  });
}
