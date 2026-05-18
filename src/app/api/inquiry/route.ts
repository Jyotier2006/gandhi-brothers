import { NextResponse } from "next/server";
import { saveInquiryToSheet, sendInquiryEmails, type InquiryRecord } from "@/lib/inquiries";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check for spam protection
    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!body.consent) {
      return NextResponse.json({ error: "Consent is required." }, { status: 400 });
    }

    const required = ["fullName", "mobileNumber", "emailAddress", "city", "country", "message", "visitorType"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const inquiry: InquiryRecord = {
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      visitorType: body.visitorType,
      fullName: body.fullName,
      mobileNumber: body.mobileNumber,
      emailAddress: body.emailAddress,
      city: body.city,
      state: body.state || "",
      country: body.country,
      message: body.message,
      categoryData: body.categoryData || {},
      consent: body.consent,
      marketingOptIn: body.marketingOptIn || false,
    };

    // Blockingly save to sheet
    await saveInquiryToSheet(inquiry);
    
    // Non-blocking send of emails
    sendInquiryEmails(inquiry).catch(e => console.error("[inquiries] Email error:", e));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Inquiry API error:", err);
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again later." }, { status: 500 });
  }
}
