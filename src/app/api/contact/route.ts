/**
 * POST /api/contact
 *
 * Validates a contact form submission and emails it to support@gandhibrothers.co.in
 * via Resend (same setup as bulk-order). Reply-to is set to the customer's email
 * so hitting Reply goes directly back to them.
 */
import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/contact-email';

type Body = {
  name: string;
  email: string;
  phone?: string;
  reason: string;
  message: string;
};

function isValid(b: any): b is Body {
  return (
    typeof b === 'object' &&
    b !== null &&
    typeof b.name === 'string' &&
    b.name.trim().length > 0 &&
    typeof b.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim()) &&
    typeof b.reason === 'string' &&
    b.reason.length > 0 &&
    typeof b.message === 'string' &&
    b.message.trim().length >= 10
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!isValid(body)) {
      return NextResponse.json(
        { error: 'Invalid or incomplete form data.' },
        { status: 400 }
      );
    }

    // If phone provided, validate format
    if (body.phone && body.phone.trim()) {
      if (!/^[6-9]\d{9}$/.test(body.phone.replace(/\s+/g, ''))) {
        return NextResponse.json(
          { error: 'Invalid phone number format.' },
          { status: 400 }
        );
      }
    }

    const messageId = `CT${Date.now()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    try {
      await sendContactEmail({
        id: messageId,
        submittedAt: new Date().toISOString(),
        name: body.name.trim(),
        email: body.email.trim(),
        phone: (body.phone ?? '').trim(),
        reason: body.reason,
        message: body.message.trim(),
      });
    } catch (emailErr) {
      console.error(`[contact ${messageId}] Email send failed:`, emailErr);
      return NextResponse.json(
        {
          error:
            'Could not send your message. Please email support@gandhibrothers.co.in directly.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
