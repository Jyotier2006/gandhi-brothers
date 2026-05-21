import { NextResponse } from "next/server";
import { addReview } from "@/lib/reviews";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const productKey = String(body.productKey ?? "").trim();
    const name = String(body.name ?? "").trim().slice(0, 60);
    const title = String(body.title ?? "").trim().slice(0, 80);
    const reviewBody = String(body.body ?? "").trim().slice(0, 1000);
    const rating = Math.round(Number(body.rating));

    if (!productKey) return NextResponse.json({ error: "Missing product." }, { status: 400 });
    if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please choose a rating from 1 to 5 stars." }, { status: 400 });
    }
    if (reviewBody.length < 10) {
      return NextResponse.json({ error: "Please write at least a sentence." }, { status: 400 });
    }

    const stored = await addReview({ productKey, name, rating, title, body: reviewBody });
    if (!stored) {
      return NextResponse.json(
        { error: "Reviews are not available right now. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reviews/submit] error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
