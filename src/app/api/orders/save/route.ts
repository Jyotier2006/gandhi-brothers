import { NextResponse } from "next/server";
import { z } from "zod";
import { saveOrderToSheet } from "@/lib/orders";
import type { OrderRecord } from "@/lib/types";

// Loose but safe validation to ensure core fields exist during a manual push.
const manualSaveSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    productName: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().min(0),
  })).min(1),
  subtotal: z.number().min(0),
  delivery: z.number().min(0),
  total: z.number().positive(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // SECURITY GUARD: Strictly internal route block
    const internalSecret = process.env.INTERNAL_API_SECRET;
    const requestSecret = req.headers.get("x-internal-secret");

    if (!internalSecret || requestSecret !== internalSecret) {
      return NextResponse.json(
        { error: "Unauthorized endpoint access." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const result = manualSaveSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Malformed order body.", details: result.error.errors },
        { status: 400 }
      );
    }
    const orderRecord: OrderRecord = {
      ...result.data,
      items: result.data.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        slug: "",
        image: "",
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // Explicit pass to backend persistance layer
    await saveOrderToSheet(orderRecord);

    return NextResponse.json({ success: true, message: "Order manually synced to Sheets." }, { status: 200 });
  } catch (error) {
    console.error("Manual order sheet save error:", error);
    return NextResponse.json(
      { error: "Internal server error during order persistence." },
      { status: 500 }
    );
  }
}
