import { Resend } from "resend";
import type { BulkInquiryRecord } from "./bulk-inquiries";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.BULK_ORDER_TO_EMAIL!;
const FROM_EMAIL = process.env.BULK_ORDER_FROM_EMAIL!;

/**
 * Sends two emails on a new bulk inquiry:
 *  1. Internal alert to the business owner (BULK_ORDER_TO_EMAIL)
 *  2. Confirmation email to the customer
 */
export async function sendBulkInquiryEmails(
  inquiry: BulkInquiryRecord
): Promise<void> {
  // 1. Internal notification to owner
  await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `New Bulk Inquiry — ${inquiry.companyName} (${inquiry.tier})`,
    html: `
      <h2 style="color:#4A3F35;font-family:sans-serif">New Wholesale Inquiry Received</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Inquiry ID</td><td style="padding:6px 12px">${inquiry.id}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Company</td><td style="padding:6px 12px">${inquiry.companyName}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Contact</td><td style="padding:6px 12px">${inquiry.contactName}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Email</td><td style="padding:6px 12px">${inquiry.email}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Phone</td><td style="padding:6px 12px">${inquiry.phone}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Tier Selected</td><td style="padding:6px 12px">${inquiry.tier}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Product Interest</td><td style="padding:6px 12px">${inquiry.productInterest}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Est. Monthly Volume</td><td style="padding:6px 12px">${inquiry.estimatedMonthlyVolume}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#A69279">Message</td><td style="padding:6px 12px">${inquiry.message || "—"}</td></tr>
        <tr style="background:#F9F7F3"><td style="padding:6px 12px;font-weight:600;color:#A69279">Submitted At</td><td style="padding:6px 12px">${inquiry.createdAt}</td></tr>
      </table>
    `,
  });

  // 2. Confirmation to the customer
  await resend.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    subject: `We received your wholesale inquiry — Gandhi Brothers`,
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#4A3F35">
        <h2 style="color:#4A3F35">Thank you, ${inquiry.contactName}!</h2>
        <p>We have received your wholesale inquiry for <strong>${inquiry.companyName}</strong> and will get back to you within <strong>1–2 business days</strong>.</p>
        <p style="background:#F9F7F3;border-left:4px solid #D4A351;padding:12px 16px;border-radius:4px">
          <strong>Inquiry Reference:</strong> ${inquiry.id}<br/>
          <strong>Tier:</strong> ${inquiry.tier}<br/>
          <strong>Est. Monthly Volume:</strong> ${inquiry.estimatedMonthlyVolume}
        </p>
        <p>If you have any urgent questions, reply to this email or call us directly.</p>
        <p style="margin-top:32px">Warm regards,<br/><strong>Gandhi Brothers</strong><br/><em>FDCA Licensed Ayurvedic Manufacturers</em></p>
      </div>
    `,
  });
}
