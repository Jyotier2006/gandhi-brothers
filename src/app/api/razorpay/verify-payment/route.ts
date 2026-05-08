import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getProductsByIds } from '@/lib/products';
import { applyStockChanges } from '@/lib/stock';
import { saveOrderToSheet } from '@/lib/orders';
import { effectivePrice } from '@/lib/utils';

type CartLine = { productId: string; quantity: number };

type Body = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  items: CartLine[];
  address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  /** Shipping cost as calculated by Shiprocket at create-order time. */
  shippingCost?: number;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
    }

    // === HMAC SIGNATURE VERIFICATION (security-critical) ===
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Payment gateway is not configured.' }, { status: 500 });
    }
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) {
      console.warn('Invalid Razorpay signature for order', razorpay_order_id);
      return NextResponse.json(
        { error: 'Payment verification failed. Order was not recorded.' },
        { status: 400 }
      );
    }

    // === Re-validate items against the Sheet (server side) ===
    const productIds = items.map((i) => i.productId);
    const products = await getProductsByIds(productIds);

    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      productName: string;
      packSize: string;
      quantity: number;
      price: number;
    }> = [];

    for (const line of items) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${line.productId}` },
          { status: 400 }
        );
      }
      const price = effectivePrice(product.price, product.discount_price);
      subtotal += price * line.quantity;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        // pack_size is added by products.ts loader (see Product type extension)
        packSize: (product as any).pack_size ?? '',
        quantity: line.quantity,
        price,
      });
    }

    const deliveryCharge = body.shippingCost ?? 0;
    const total = Math.round(subtotal + deliveryCharge);

    // === Generate order ID ===
    const orderId = `GB${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    // === STEP 1: Decrement stock + write audit log ===
    // Done first so even if order-save fails downstream, stock is consistent.
    try {
      await applyStockChanges(
        orderItems.map((oi) => ({
          skuCode: oi.productId,
          productName: oi.productName,
          packSize: oi.packSize,
          quantity: oi.quantity,
          reason: `Order ${orderId}`,
        }))
      );
    } catch (e) {
      // Don't fail the response — payment is already complete. Log loudly.
      console.error('Stock decrement failed for order', orderId, e);
    }

    // === STEP 2: Save order to Orders sheet ===
    try {
      await saveOrderToSheet({
        id: orderId,
        createdAt,
        customer: address,
        items: orderItems,
        subtotal,
        delivery: deliveryCharge,
        total,
        razorpay_order_id,
        razorpay_payment_id,
      } as any);
    } catch (e) {
      console.error('Order-save failed for', orderId, e);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (e) {
    console.error('verify-payment error:', e);
    return NextResponse.json(
      { error: 'Internal error. Please contact support.' },
      { status: 500 }
    );
  }
}
