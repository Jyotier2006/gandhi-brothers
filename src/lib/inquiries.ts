import { google } from "googleapis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "support@gandhibrothers.co.in";
const FROM_EMAIL = process.env.BULK_ORDER_FROM_EMAIL || "onboarding@resend.dev";

export interface InquiryRecord {
  timestamp: string;
  visitorType: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  city: string;
  state: string;
  country: string;
  message: string;
  categoryData: Record<string, any>;
  consent: boolean;
  marketingOptIn: boolean;
}

export async function saveInquiryToSheet(inquiry: InquiryRecord) {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !privateKey || !spreadsheetId) return;

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const rowData = [
    inquiry.timestamp,
    inquiry.visitorType,
    inquiry.fullName,
    inquiry.mobileNumber,
    inquiry.emailAddress,
    inquiry.city,
    inquiry.state,
    inquiry.country,
    inquiry.message,
    JSON.stringify(inquiry.categoryData),
    inquiry.consent ? "Yes" : "No",
    inquiry.marketingOptIn ? "Yes" : "No"
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Inquiries!A:L",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rowData] },
  });
}

export async function sendInquiryEmails(inquiry: InquiryRecord) {
  const prefixMap: Record<string, string> = {
    "Doctor / Vaidya / Clinic": "[Sales]",
    "Retailer / Pharmacy": "[Sales]",
    "End Consumer / Patient": "[Sales]",
    "Distributor / Wholesaler": "[BD]",
    "Hospital / Institution": "[BD]",
    "Export Buyer (International)": "[Export]",
    "Private Label / Third-Party Manufacturing": "[Mfg]",
    "Researcher / Student": "[Academic]",
  };

  const prefix = prefixMap[inquiry.visitorType] || "[Inquiry]";
  const subject = `${prefix} New Inquiry from ${inquiry.fullName} (${inquiry.visitorType})`;

  let categoryHtml = "";
  for (const [k, v] of Object.entries(inquiry.categoryData)) {
    const val = Array.isArray(v) ? v.join(", ") : (v || "—");
    categoryHtml += `<tr><td style="padding:6px 12px;font-weight:600;color:#A69279">${k}</td><td style="padding:6px 12px">${val}</td></tr>`;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject,
    html: `
      <h2 style="color:#4A3F35;font-family:sans-serif">New Inquiry Received</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Time</td><td style="padding:6px 12px">${inquiry.timestamp}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Name</td><td style="padding:6px 12px">${inquiry.fullName}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Phone</td><td style="padding:6px 12px">${inquiry.mobileNumber}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Email</td><td style="padding:6px 12px">${inquiry.emailAddress}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Location</td><td style="padding:6px 12px">${inquiry.city}, ${inquiry.state}, ${inquiry.country}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Type</td><td style="padding:6px 12px">${inquiry.visitorType}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Message</td><td style="padding:6px 12px">${inquiry.message}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Subscribed?</td><td style="padding:6px 12px">${inquiry.marketingOptIn ? "Yes" : "No"}</td></tr>
        ${categoryHtml}
      </table>
    `
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: inquiry.emailAddress,
    subject: "We received your inquiry.",
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#4A3F35">
        <p>Thank you for reaching out to us.</p>
        <p>We have received your inquiry and will respond within 1–2 business days.</p>
        <p style="margin-top:32px">Warm regards,<br/><strong>Gandhi Brothers</strong> · Junagadh</p>
      </div>
    `
  });
}
