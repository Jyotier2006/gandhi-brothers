import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getOrder, updateOrderInSheet } from '@/lib/orders';
import { sendOrderEmail } from '@/lib/email';
import type { OrderEmailPayload } from '@/lib/email';
import { directShip } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[webhook] RAZORPAY_WEBHOOK_SECRET is not configured.');
      return NextResponse.json({ ok: true });
    }

    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') ?? '';

    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSig !== signature) {
      console.warn('[webhook] Invalid Razorpay webhook signature');
      return NextResponse.json({ ok: true });
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ ok: true });
    }

    if (event?.event !== 'payment.captured') {
      return NextResponse.json({ ok: true });
    }

    const payment = event?.payload?.payment?.entity;
    if (!payment) return NextResponse.json({ ok: true });

    const razorpayOrderId: string = payment.order_id ?? '';
    const razorpayPaymentId: string = payment.id ?? '';

    if (!razorpayOrderId) return NextResponse.json({ ok: true });

    // 1. Fetch order from DB
    let orderRecord = await getOrder(razorpayOrderId).catch(() => null);

    // 2. Idempotency check
    if (orderRecord && orderRecord.fulfillmentDone) {
      console.log(`[webhook] Order ${razorpayOrderId} already fulfilled — skipping.`);
      return NextResponse.json({ ok: true });
    }

    // 3. Update or construct basic order fields
    const notes = payment.notes ?? {};
    const amount = Math.round((payment.amount ?? 0) / 100);

    if (!orderRecord) {
      // If verify-payment failed to even save the order, the webhook is all we have.
      // We don't have the cart lines in the webhook payload generally.
      // A full sync would rely on the notes or just a fallback.
      orderRecord = {
        id: notes.orderId ?? razorpayOrderId,
        createdAt: new Date().toISOString(),
        customer: {
          name: notes.customerName ?? 'Customer',
          email: notes.customerEmail ?? '',
          phone: notes.customerPhone ?? '—',
          address: notes.address ?? '—',
          city: notes.city ?? '—',
          state: notes.state ?? '—',
          pincode: notes.pincode ?? '—',
        },
        items: [], // Shiprocket will default to "Assorted Products"
        subtotal: amount,
        delivery: 0,
        total: amount,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        paymentStatus: 'paid',
        paidAt: new Date().toISOString()
      } as any;
      
      // Save it initially to get it in the DB
      try {
        const { saveOrderToSheet } = await import('@/lib/orders');
        await saveOrderToSheet(orderRecord as any);
      } catch(e) {}
    } else {
      orderRecord.razorpay_payment_id = razorpayPaymentId;
      orderRecord.paymentStatus = 'paid';
      orderRecord.paidAt = new Date().toISOString();
    }

    // 4. Shiprocket Direct Ship
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

    // 5. Send Email
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
        items: orderRecord!.items?.length > 0 ? orderRecord!.items.map((oi: any) => ({
          name: oi.name || oi.productName || "Product",
          quantity: oi.quantity || 1,
          price: oi.price || amount,
        })) : [],
        subtotal: orderRecord!.subtotal,
        delivery: orderRecord!.delivery,
        total: orderRecord!.total,
        razorpayOrderId,
        razorpayPaymentId,
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

    // 6. Final sync to Sheet
    orderRecord!.fulfillmentDone = true;
    try {
      await updateOrderInSheet(orderRecord as any);
    } catch {}

  } catch (e) {
    console.error('[webhook] Unhandled error:', e);
  }

  return NextResponse.json({ ok: true });
}
