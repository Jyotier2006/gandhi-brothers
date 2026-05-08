import { google } from "googleapis";

export interface BulkInquiryRecord {
  id: string;
  createdAt: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  productInterest: string;
  estimatedMonthlyVolume: string;
  message: string;
  tier: string;
}

/**
 * Appends a bulk inquiry row to the "Bulk Inquiries" sheet tab.
 * Uses the same Google Service Account credentials as orders.ts.
 *
 * Sheet columns (A–J):
 *   Inquiry ID | Created At | Company | Contact Name | Email |
 *   Phone | Product Interest | Est. Monthly Volume | Tier | Message
 */
export async function saveBulkInquiryToSheet(
  inquiry: BulkInquiryRecord
): Promise<void> {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !privateKey || !spreadsheetId) {
    throw new Error(
      "Google Sheets credentials not configured. Please check environment variables."
    );
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const rowData = [
    inquiry.id,                      // A: Inquiry ID
    inquiry.createdAt,               // B: Created At
    inquiry.companyName,             // C: Company
    inquiry.contactName,             // D: Contact Name
    inquiry.email,                   // E: Email
    inquiry.phone,                   // F: Phone
    inquiry.productInterest,         // G: Product Interest
    inquiry.estimatedMonthlyVolume,  // H: Est. Monthly Volume
    inquiry.tier,                    // I: Tier
    inquiry.message,                 // J: Message
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Bulk Inquiries!A:J",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowData],
    },
  });
}
