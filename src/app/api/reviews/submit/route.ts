import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addReview, hasUserReviewed } from "@/lib/reviews";
import { hasPurchasedProduct } from "@/lib/purchases";

export async function POST(req: Request) {
  try {
    // 1. Must be signed in.
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json(
        { error: "Please sign in to write a review." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const productKey = String(body.productKey ?? "").trim();
    const name =
      (String(body.name ?? "").trim() || session.user?.name || "Verified buyer").slice(0, 60);
    const title = String(body.title ?? "").trim().slice(0, 80);
    const reviewBody = String(body.body ?? "").trim().slice(0, 1000);
    const rating = Math.round(Number(body.rating));

    if (!productKey) return NextResponse.json({ error: "Missing product." }, { status: 400 });
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please choose a rating from 1 to 5 stars." }, { status: 400 });
    }
    if (reviewBody.length < 10) {
      return NextResponse.json({ error: "Please write at least a sentence." }, { status: 400 });
    }

    // 2. Must have actually bought this product (checked against their orders).
    const purchased = await hasPurchasedProduct(email, productKey);
    if (!purchased) {
      return NextResponse.json(
        { error: "Only verified buyers can review this product." },
        { status: 403 }
      );
    }

    // 3. One review per buyer per product.
    if (await hasUserReviewed(productKey, email)) {
      return NextResponse.json(
        { error: "You've already reviewed this product." },
        { status: 409 }
      );
    }

    const stored = await addReview({
      productKey,
      name,
      rating,
      title,
      body: reviewBody,
      verified: true,
      email,
    });
    if (!stored) {
      return NextResponse.json(
        { error: "Reviews are not available right now. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (err) {
    console.error("[reviews/submit] error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
