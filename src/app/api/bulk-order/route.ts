import { NextResponse } from "next/server";
import { saveBulkInquiryToSheet } from "@/lib/bulk-inquiries";
import { sendBulkInquiryEmails } from "@/lib/email";
import type { BulkInquiryRecord } from "@/lib/bulk-inquiries";

/** Generates a short uppercase ID like INQ-A1B2C3D4 */
function makeInquiryId(): string {
  const raw = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `INQ-${raw}`;
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      companyName,
      contactName,
      email,
      phone,
      productInterest,
      estimatedMonthlyVolume,
      message,
      tier,
    } = body;

    // Basic validation
    if (!companyName || !contactName || !email || !phone || !productInterest || !estimatedMonthlyVolume || !tier) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const inquiry: BulkInquiryRecord = {
      id: makeInquiryId(),
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      companyName,
      contactName,
      email,
      phone,
      productInterest,
      estimatedMonthlyVolume,
      message: message || "",
      tier,
    };

    // Save to Google Sheet
    await saveBulkInquiryToSheet(inquiry);

    // Send confirmation emails (non-blocking errors logged, don't fail the request)
    try {
      await sendBulkInquiryEmails(inquiry);
    } catch (emailError) {
      console.error("Email send failed (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true, inquiryId: inquiry.id });
  } catch (error) {
    console.error("Bulk order API error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
