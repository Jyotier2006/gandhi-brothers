/**
 * Send contact-form messages via Resend.
 *
 * Defensive design: if RESEND_API_KEY is missing, throws so the API caller
 * can return a helpful error to the user (rather than silently dropping
 * the message).
 */
type ContactMessage = {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

export async function sendContactEmail(msg: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.BULK_ORDER_TO_EMAIL || 'support@gandhibrothers.co.in';
  const fromEmail = process.env.BULK_ORDER_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  // Lazy-import Resend so a missing key doesn't crash file imports
  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  const safe = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const notificationHtml = `
    <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color: #6B4A35;">
      <div style="background: #F2EDE4; padding: 24px; text-align: center; border-bottom: 3px solid #A57051;">
        <h1 style="margin: 0; font-size: 22px;">New Contact Message</h1>
        <p style="margin: 8px 0 0; font-size: 13px; color: #9A7C62;">Reference: ${safe(msg.id)}</p>
      </div>
      <div style="padding: 24px; background: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #9A7C62; width: 30%; font-weight: 600;">Name</td>
            <td style="padding: 8px 0;">${safe(msg.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9A7C62; font-weight: 600;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${safe(msg.email)}" style="color: #A57051;">${safe(msg.email)}</a>
            </td>
          </tr>
          ${msg.phone
            ? `<tr>
                <td style="padding: 8px 0; color: #9A7C62; font-weight: 600;">Phone</td>
                <td style="padding: 8px 0;">
                  <a href="tel:${safe(msg.phone)}" style="color: #A57051;">${safe(msg.phone)}</a>
                </td>
              </tr>`
            : ''}
          <tr>
            <td style="padding: 8px 0; color: #9A7C62; font-weight: 600;">Reason</td>
            <td style="padding: 8px 0;">${safe(msg.reason)}</td>
          </tr>
        </table>

        <h3 style="margin: 24px 0 8px; color: #A57051; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Message</h3>
        <div style="background: #FBF8F2; padding: 16px; border-left: 3px solid #A57051; white-space: pre-wrap; line-height: 1.6;">${safe(msg.message)}</div>

        <p style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #E5DDD2; font-size: 12px; color: #9A7C62;">
          Submitted at ${new Date(msg.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}<br>
          Hit Reply to respond directly to ${safe(msg.name)}.
        </p>
      </div>
    </div>
  `;

  const ackHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #6B4A35;">
      <div style="background: #F2EDE4; padding: 28px; text-align: center; border-bottom: 3px solid #A57051;">
        <h1 style="margin: 0; font-size: 24px;">Thank you, ${safe(msg.name)}</h1>
        <p style="margin: 12px 0 0; color: #9A7C62; font-size: 14px;">We&rsquo;ve received your message.</p>
      </div>
      <div style="padding: 28px; background: #FFFFFF; line-height: 1.7;">
        <p>Our team will review your message and respond within <strong>1 business day</strong> at this email address.</p>

        <div style="background: #FBF8F2; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9A7C62;">Reference Number</p>
          <p style="margin: 0; font-size: 18px; font-weight: 600;">${safe(msg.id)}</p>
        </div>

        <p>For urgent matters: <a href="tel:+919106980909" style="color: #A57051;">+91 9106 9809 09</a></p>

        <hr style="border: none; border-top: 1px solid #E5DDD2; margin: 28px 0 20px;">
        <p style="margin: 0; font-size: 13px; color: #9A7C62;">
          <strong style="color: #6B4A35;">Gandhi Brothers</strong><br>
          Gomti Bhavan, Azad Chowk, Junagadh, Gujarat 362001<br>
          FDCA Licence: GA/2079
        </p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: `Gandhi Brothers Website <${fromEmail}>`,
    to: [toEmail],
    replyTo: msg.email,
    subject: `[Contact] ${msg.name} — ${msg.reason} (${msg.id})`,
    html: notificationHtml,
  });

  await resend.emails.send({
    from: `Gandhi Brothers <${fromEmail}>`,
    to: [msg.email],
    replyTo: toEmail,
    subject: `We received your message (${msg.id})`,
    html: ackHtml,
  });
}
