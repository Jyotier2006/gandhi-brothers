/**
 * POST /api/razorpay/create-order
 *
 * Creates a Razorpay order. Calculates total = subtotal + shipping where shipping
 * is fetched fresh from Shiprocket server-side (we never trust client-sent
 * shipping numbers).
 */
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getProductsByIds } from '@/lib/products';
import { getShippingQuote, totalCartWeightKg } from '@/lib/shiprocket';
import { effectivePrice } from '@/lib/utils';

type CartLine = { productId: string; quantity: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: CartLine[] = body.items || [];
    const pincode: string = body.pincode || '';

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit pincode.' },
        { status: 400 }
      );
    }

    // Re-fetch products from Sheet — ignore any prices/weights the client sent
    const productIds = items.map((i) => i.productId);
    const products = await getProductsByIds(productIds);

    let subtotal = 0;
    const cartWeights: Array<{ weightGrams: number; quantity: number }> = [];

    for (const line of items) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${line.productId}` },
          { status: 400 }
        );
      }
      if (line.quantity <= 0 || !Number.isInteger(line.quantity)) {
        return NextResponse.json(
          { error: `Invalid quantity for ${product.name}.` },
          { status: 400 }
        );
      }
      if (line.quantity > product.stock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.stock} left.` },
          { status: 400 }
        );
      }
      subtotal += effectivePrice(product.price, product.discount_price) * line.quantity;
      cartWeights.push({
        weightGrams: (product as any).weight_grams ?? 200,
        quantity: line.quantity,
      });
    }

    // Server-side shipping calculation — single source of truth
    const weightKg = totalCartWeightKg(cartWeights);
    const quote = await getShippingQuote(pincode, weightKg);

    if (!quote.serviceable) {
      return NextResponse.json(
        { error: `Sorry, we don't ship to pincode ${pincode} yet.` },
        { status: 400 }
      );
    }

    const totalRupees = Math.round(subtotal + quote.rate);
    const amountPaise = totalRupees * 100;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        item_count: String(items.length),
        pincode,
        shipping: String(quote.rate),
        subtotal: String(subtotal),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountPaise,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      // Echo back the breakdown so client UI can show consistent numbers
      breakdown: {
        subtotal,
        shipping: quote.rate,
        total: totalRupees,
        estimatedDays: quote.estimatedDays,
      },
    });
  } catch (e) {
    console.error('create-order error:', e);
    return NextResponse.json(
      { error: 'Could not create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
