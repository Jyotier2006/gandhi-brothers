import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getProductsByIds } from '@/lib/products';
import { applyStockChanges } from '@/lib/stock';
import { saveOrderToSheet, getOrder, updateOrderInSheet } from '@/lib/orders';
import { effectivePrice } from '@/lib/utils';
import { sendOrderEmail } from '@/lib/email';
import type { OrderEmailPayload } from '@/lib/email';

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

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ error: 'Gateway not configured.' }, { status: 500 });
    
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
      
    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
    }

    // 1. Fetch order from DB
    let orderRecord = await getOrder(razorpay_order_id).catch(() => null);

    // 2. Idempotency check
    if (orderRecord && orderRecord.fulfillmentDone) {
      return NextResponse.json({ success: true, orderId: orderRecord.id });
    }

    let orderItems: any[] = [];
    let deliveryCharge = body.shippingCost ?? 0;
    
    if (!orderRecord) {
      // First time hitting verification: validate items, calc stock, create record
      const productIds = items.map((i) => i.productId);
      const products = await getProductsByIds(productIds);
      let subtotal = 0;

      // Captured separately for the stock-movement audit log (needs pack size).
      const stockChanges: { skuCode: string; productName: string; packSize: string; quantity: number }[] = [];

      for (const line of items) {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return NextResponse.json({ error: `Product missing` }, { status: 400 });
        const price = effectivePrice(product.price, product.discount_price);
        subtotal += price * line.quantity;
        // Conform to the OrderLineItem shape so saveOrderToSheet/email read the right fields.
        orderItems.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price,
          quantity: line.quantity,
          image: product.image,
        });
        stockChanges.push({
          skuCode: product.id,
          productName: product.name,
          packSize: (product as any).pack_size ?? '',
          quantity: line.quantity,
        });
      }

      const total = Math.round(subtotal + deliveryCharge);
      const orderId = `GB${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      try {
        await applyStockChanges(stockChanges.map((sc) => ({ ...sc, reason: `Order ${orderId}` })));
      } catch (e) {
        console.error('Stock decrement error:', e);
      }

      orderRecord = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: address,
        items: orderItems,
        subtotal,
        delivery: deliveryCharge,
        total,
        razorpay_order_id,
        razorpay_payment_id,
        paymentStatus: "paid",
        paidAt: new Date().toISOString()
      } as any;

      try {
        await saveOrderToSheet(orderRecord as any);
      } catch (e) {
        console.error('Order save err:', e);
      }
    } else {
      orderRecord.razorpay_payment_id = razorpay_payment_id;
      orderRecord.paymentStatus = "paid";
      orderRecord.paidAt = new Date().toISOString();
      orderItems = orderRecord.items || [];
    }

    // 4. Call directShip(order) -> update state locally
    const { directShip } = await import('@/lib/shiprocket');
    const shipResult = await directShip(orderRecord) as any;
    if (shipResult.error) {
      orderRecord!.shippingError = shipResult.error;
    } else {
      orderRecord!.shiprocketOrderId = shipResult.shiprocketOrderId;
      orderRecord!.shipmentId = shipResult.shipmentId?.toString();
      orderRecord!.awbCode = shipResult.awbCode;
      orderRecord!.courierName = shipResult.courierName;
      orderRecord!.labelUrl = shipResult.labelUrl;
    }

    // 5. Send order email
    if (!orderRecord!.emailSent) {
      const emailPayload: OrderEmailPayload = {
        orderId: orderRecord!.id,
        createdAt: orderRecord!.createdAt,
        customerName: orderRecord!.customer.name,
        customerEmail: orderRecord!.customer.email,
        customerPhone: orderRecord!.customer.phone,
        address: orderRecord!.customer.address,
        city: orderRecord!.customer.city,
        state: orderRecord!.customer.state,
        pincode: orderRecord!.customer.pincode,
        items: orderItems.length > 0 ? orderItems.map((oi: any) => ({
          name: oi.name || oi.productName,
          quantity: oi.quantity,
          price: oi.price,
        })) : [],
        subtotal: orderRecord!.subtotal,
        delivery: orderRecord!.delivery,
        total: orderRecord!.total,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        shiprocketOrderId: orderRecord!.shiprocketOrderId,
        awbCode: orderRecord!.awbCode,
        courierName: orderRecord!.courierName,
        labelUrl: orderRecord!.labelUrl,
      };

      try {
        const sent = await sendOrderEmail(emailPayload);
        if (sent) orderRecord!.emailSent = true;
        else orderRecord!.emailError = "Email rejected";
      } catch (e: any) {
        orderRecord!.emailError = e.message;
      }
    }

    // 6. Set fulfillmentDone and save
    orderRecord!.fulfillmentDone = true;
    try {
      await updateOrderInSheet(orderRecord as any);
    } catch (err) {
      console.error('[orders] sheet sync failed (non-fatal):', err);
    }

    return NextResponse.json({ success: true, orderId: orderRecord!.id });
  } catch (e) {
    console.error('verify-payment err:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
