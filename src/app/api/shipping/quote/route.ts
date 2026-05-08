/**
 * POST /api/shipping/quote
 *
 * Body: { pincode: string, items: [{ productId, quantity }] }
 * Returns: { serviceable, rate, estimatedDays }
 *
 * Used by the checkout page to fetch live shipping cost when customer enters
 * their pincode. The rate is also re-fetched server-side at order-create time
 * (in /api/razorpay/create-order) — never trust client-sent shipping numbers.
 */
import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/products';
import { getShippingQuote, totalCartWeightKg } from '@/lib/shiprocket';

type Body = {
  pincode: string;
  items: Array<{ productId: string; quantity: number }>;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body.pincode || !/^\d{6}$/.test(body.pincode)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit pincode.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty.' },
        { status: 400 }
      );
    }

    // Re-fetch products from Sheet to get accurate weights
    const productIds = body.items.map((i) => i.productId);
    const products = await getProductsByIds(productIds);

    // Build a list of { weightGrams, quantity } for the cart
    const cartWeights = body.items.map((line) => {
      const product = products.find((p) => p.id === line.productId);
      const weightGrams = (product as any)?.weight_grams ?? 0;
      return { weightGrams, quantity: line.quantity };
    });

    // Sanity check: every product should have weight defined
    const missingWeights = body.items.filter((line, idx) => cartWeights[idx].weightGrams <= 0);
    if (missingWeights.length > 0) {
      console.warn('[shipping/quote] Products with missing weight:', missingWeights);
      // Fall back to default 200g per item to avoid breaking checkout entirely
      cartWeights.forEach((cw) => {
        if (cw.weightGrams <= 0) cw.weightGrams = 200;
      });
    }

    const weightKg = totalCartWeightKg(cartWeights);
    const quote = await getShippingQuote(body.pincode, weightKg);

    if (!quote.serviceable) {
      return NextResponse.json({
        serviceable: false,
        rate: 0,
        estimatedDays: 0,
      });
    }

    return NextResponse.json({
      serviceable: true,
      rate: quote.rate,
      estimatedDays: quote.estimatedDays,
    });
  } catch (err) {
    console.error('[shipping/quote] error:', err);
    return NextResponse.json(
      { error: 'Could not fetch shipping rate. Please try again.' },
      { status: 500 }
    );
  }
}
