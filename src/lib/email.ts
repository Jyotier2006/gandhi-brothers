import type { BulkInquiryRecord } from "./bulk-inquiries";
import { getResend } from "./resend-client";

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
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping bulk inquiry emails.");
    return;
  }

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

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER CONFIRMATION EMAILS
// ═══════════════════════════════════════════════════════════════════════════════
//
// DNS SETUP REQUIRED for gandhibrothers.co.in before going live:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Log in to https://resend.com/domains → "Add Domain" → enter: gandhibrothers.co.in
// 2. Resend shows three DNS records — add them at your DNS host (Hostinger / GoDaddy / Cloudflare):
//
//    TYPE   HOST                  VALUE
//    TXT    @                     "v=spf1 include:amazonses.com ~all"
//    CNAME  resend._domainkey     <value from Resend dashboard>
//    TXT    _dmarc                "v=DMARC1; p=none; rua=mailto:postmaster@gandhibrothers.co.in"
//
// 3. Wait for DNS propagation (5–30 min). Resend will auto-verify.
// 4. Set FROM_EMAIL=orders@gandhibrothers.co.in in production .env.
//    During development: FROM_EMAIL=onboarding@resend.dev (Resend sandbox).
//
// Environment variables:
//   RESEND_API_KEY   — from https://resend.com/api-keys
//   ADMIN_EMAILS     — comma-separated, e.g. a@x.com,b@x.com,c@x.com
//   FROM_EMAIL       — verified sender address
// ═══════════════════════════════════════════════════════════════════════════════

export type OrderEmailPayload = {
  orderId: string;
  createdAt: string;
  customerName: string;
  customerEmail: string | null | undefined;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  delivery: number;
  total: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  /** Optional — populated when Shiprocket AWB is available */
  shiprocketOrderId?: string;
  awbCode?: string;
  courierName?: string;
  labelUrl?: string;
};

// ── Shared HTML builder ───────────────────────────────────────────────────────

function buildOrderEmailHtml(
  order: OrderEmailPayload,
  recipientType: "admin" | "customer"
): string {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e8dfd5;color:#4a3728;font-size:14px;">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8dfd5;color:#4a3728;font-size:14px;text-align:center;">×${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8dfd5;color:#A57051;font-size:14px;text-align:right;font-weight:600;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  let trackingRow = "";
  if (order.awbCode) {
    trackingRow = `<tr>
        <td style="padding:8px 0;color:#8a7060;font-size:13px;width:140px;">Tracking</td>
        <td style="padding:8px 0;color:#4a3728;font-size:13px;font-weight:600;">${order.courierName} — AWB: ${order.awbCode}</td>
      </tr>`;
  }
  
  // Admin extras
  if (recipientType === "admin") {
    if (order.labelUrl) {
      trackingRow += `<tr>
        <td style="padding:8px 0;color:#8a7060;font-size:13px;width:140px;">Label</td>
        <td style="padding:8px 0;"><a href="${order.labelUrl}" style="color:#D9A536;font-size:13px;font-weight:600;text-decoration:none;">Download Label</a></td>
      </tr>`;
    } else if (!order.awbCode) {
      trackingRow += `<tr>
        <td colspan="2" style="padding:12px 16px;background:#fdf3f3;border-left:4px solid #d9534f;color:#d9534f;font-size:13px;font-weight:600;margin-top:8px;border-radius:4px;">
          ⚠ Shipping booking pending — please book manually
        </td>
      </tr>`;
    }
  }

  const heading =
    recipientType === "admin"
      ? `New Order Received — #${order.orderId}`
      : `Your Order is Confirmed! 🎉`;

  const subheading =
    recipientType === "customer"
      ? `<p style="margin:0;color:#8a7060;font-size:14px;">Thank you for shopping with <strong>Gandhi Brothers</strong>. We're preparing your order!</p>`
      : `<p style="margin:0;color:#8a7060;font-size:14px;">A new order has been placed and payment captured on Razorpay.</p>`;

  const year = new Date().getFullYear();
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<title>Gandhi Brothers — Order #${order.orderId}</title>
</head>
<body style="margin:0;padding:0;background:#e8e0d4;font-family:'Poppins',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8e0d4;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#F2EDE4;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(101,74,53,0.12);">

<!-- Header -->
<tr>
<td style="background:linear-gradient(135deg,#A57051 0%,#8B5E3C 100%);padding:32px 36px;text-align:center;">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#F2EDE4;opacity:0.7;text-transform:uppercase;">Gandhi Brothers</p>
<h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.3px;">${heading}</h1>
<p style="margin:8px 0 0;font-size:12px;color:#f0d9c4;opacity:0.85;">Order <strong>${order.orderId}</strong> &nbsp;|&nbsp; ${orderDate}</p>
</td>
</tr>

<!-- Body -->
<tr><td style="padding:32px 36px;">
${subheading}

<!-- Customer Details -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#ece6da;border-radius:10px;padding:20px 24px;">
<tr><td colspan="2" style="padding-bottom:12px;font-size:13px;font-weight:700;color:#A57051;letter-spacing:1px;text-transform:uppercase;">Customer Details</td></tr>
<tr>
  <td style="padding:6px 0;color:#8a7060;font-size:13px;width:140px;">Name</td>
  <td style="padding:6px 0;color:#4a3728;font-size:13px;font-weight:600;">${order.customerName}</td>
</tr>
<tr>
  <td style="padding:6px 0;color:#8a7060;font-size:13px;">Email</td>
  <td style="padding:6px 0;color:#4a3728;font-size:13px;">${order.customerEmail ?? "—"}</td>
</tr>
<tr>
  <td style="padding:6px 0;color:#8a7060;font-size:13px;">Phone</td>
  <td style="padding:6px 0;color:#4a3728;font-size:13px;">${order.customerPhone}</td>
</tr>
<tr>
  <td style="padding:6px 0;color:#8a7060;font-size:13px;">Shipping To</td>
  <td style="padding:6px 0;color:#4a3728;font-size:13px;">${order.address}, ${order.city}, ${order.state} — ${order.pincode}</td>
</tr>
${trackingRow}
</table>

<!-- Items Table -->
<p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#A57051;letter-spacing:1px;text-transform:uppercase;">Order Items</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e0d6c8;">
<thead>
<tr style="background:#A57051;">
  <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#fff;letter-spacing:0.5px;">Product</th>
  <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#fff;letter-spacing:0.5px;">Qty</th>
  <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#fff;letter-spacing:0.5px;">Amount</th>
</tr>
</thead>
<tbody>${itemRows}</tbody>
</table>

<!-- Totals -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
<tr>
  <td style="padding:6px 0;color:#8a7060;font-size:13px;">Subtotal</td>
  <td style="padding:6px 0;color:#4a3728;font-size:13px;text-align:right;">₹${order.subtotal.toLocaleString("en-IN")}</td>
</tr>
<tr>
  <td style="padding:6px 0;color:#8a7060;font-size:13px;">Delivery</td>
  <td style="padding:6px 0;color:#4a3728;font-size:13px;text-align:right;">${order.delivery === 0 ? "FREE" : `₹${order.delivery.toLocaleString("en-IN")}`}</td>
</tr>
<tr>
  <td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#6B4A35;border-top:2px solid #D9A536;">Total Paid</td>
  <td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#D9A536;text-align:right;border-top:2px solid #D9A536;">₹${order.total.toLocaleString("en-IN")}</td>
</tr>
</table>

<!-- Payment IDs -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;background:#ece6da;border-radius:10px;padding:16px 20px;">
<tr><td style="color:#8a7060;font-size:12px;">Razorpay Payment ID</td></tr>
<tr><td style="color:#A57051;font-size:13px;font-weight:600;font-family:monospace;">${order.razorpayPaymentId}</td></tr>
<tr><td style="color:#8a7060;font-size:12px;padding-top:8px;">Razorpay Order ID</td></tr>
<tr><td style="color:#A57051;font-size:13px;font-weight:600;font-family:monospace;">${order.razorpayOrderId}</td></tr>
</table>

</td></tr>

<!-- Footer -->
<tr>
<td style="background:#6B4A35;padding:20px 36px;text-align:center;">
<p style="margin:0;font-size:12px;color:#c9a98a;">© ${year} Gandhi Brothers · FDCA-Licensed Ayurvedic Manufacturer</p>
<p style="margin:6px 0 0;font-size:11px;color:#a07050;">This is an automated email. Please do not reply directly.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Sends order confirmation emails:
 *   1. Admin notification  → all ADMIN_EMAILS (comma-split from env)
 *   2. Customer confirmation → order.customerEmail (skipped + warned if missing)
 *
 * NEVER throws — all failures caught and logged with [email] prefix.
 * The webhook / verify-payment route returns 200 to Razorpay regardless.
 *
 * @returns true if at least one email was accepted by Resend, false otherwise.
 */
export async function sendOrderEmail(order: OrderEmailPayload): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping order emails.");
    return false;
  }

  const from = process.env.FROM_EMAIL || "onboarding@resend.dev";
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    console.warn("[email] ADMIN_EMAILS env var is empty — skipping admin email.");
  }

  const sends: Promise<unknown>[] = [];

  // ── Admin email ──────────────────────────────────────────────────────────
  if (adminEmails.length > 0) {
    sends.push(
      resend.emails.send({
        from,
        to: adminEmails,
        subject: `🟢 New Order #${order.orderId} — ₹${order.total} — ${order.city}`,
        html: buildOrderEmailHtml(order, "admin"),
      })
    );
  }

  // ── Customer email ───────────────────────────────────────────────────────
  if (order.customerEmail?.includes("@")) {
    sends.push(
      resend.emails.send({
        from,
        to: [order.customerEmail],
        subject: `Order Confirmed ✓ Gandhi Brothers — #${order.orderId}`,
        html: buildOrderEmailHtml(order, "customer"),
      })
    );
  } else {
    console.warn(
      `[email] No valid customer email for order ${order.orderId}; skipping customer confirmation.`
    );
  }

  if (sends.length === 0) return false;

  const results = await Promise.allSettled(sends);
  let anySuccess = false;

  results.forEach((result, idx) => {
    const hasAdmin = adminEmails.length > 0;
    const label = idx === 0 && hasAdmin ? "admin" : "customer";
    if (result.status === "fulfilled") {
      const r = result.value as { data?: { id?: string }; error?: unknown };
      if (r?.error) {
        console.error(`[email] Resend API error (${label}) for order ${order.orderId}:`, r.error);
      } else {
        console.log(`[email] ${label} email queued for order ${order.orderId}. id=${r?.data?.id}`);
        anySuccess = true;
      }
    } else {
      console.error(
        `[email] Failed to send ${label} email for order ${order.orderId}:`,
        result.reason
      );
    }
  });

  return anySuccess;
}
