import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Truck, Package, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Order Successful | Gandhi Brothers",
  description: "Your order at Gandhi Brothers has been confirmed.",
};

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams;
  const { orderId } = params;
  
  const order = orderId ? await getOrderById(orderId).catch(() => null) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center min-h-[75vh] flex flex-col items-center justify-center">
      <CheckCircle2 className="h-20 w-20 mx-auto text-green-600 mb-6" />
      
      <h1 className="text-3xl md:text-4xl font-sans font-semibold text-ink mb-4">
        Thank you for your order
      </h1>
      
      <p className="text-ink/80 font-serif text-lg mb-6">
        Your payment has been verified and your order is confirmed.
      </p>

      {orderId && order && (
        <div className="bg-cream border border-terracotta/20 rounded-xl p-6 w-full mb-8 text-left shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-ink/10 mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Order Reference</p>
              <p className="text-xl font-mono text-ink font-medium mt-1">{order.id}</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Total Paid</p>
              <p className="text-xl text-mustard font-semibold mt-1">₹{order.total.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 pb-6 border-b border-ink/10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-terracotta mb-3">Shipping To</p>
              <div className="text-ink/80 text-sm leading-relaxed">
                <p className="font-medium text-ink">{order.customer.name}</p>
                <p>{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
                <p className="mt-2 text-ink/60">{order.customer.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-terracotta mb-3">Shipment Status</p>
              {order.awbCode ? (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-terracotta/10">
                  <div className="flex items-center gap-3 text-ink font-medium mb-2">
                    <Truck className="h-5 w-5 text-terracotta" />
                    Tracking: {order.courierName}
                  </div>
                  <p className="font-mono text-sm mb-3">AWB: {order.awbCode}</p>
                  <Button size="sm" variant="outline" className="w-full text-mustard border-mustard hover:bg-mustard/10" asChild>
                    <a href={`https://shiprocket.co/tracking/${order.awbCode}`} target="_blank" rel="noopener noreferrer">
                      Track Package
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-terracotta/10 text-ink/80">
                  <Package className="h-6 w-6 text-terracotta mb-2" />
                  <p className="text-sm">We are packing your order. Shipping details and tracking will be emailed shortly.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta mb-3">Order Items</p>
            <ul className="space-y-2">
              {order.items.map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center text-sm text-ink/80">
                  <span>{item.quantity} × {item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="text-ink/60 text-sm max-w-sm mx-auto mb-8">
        We've sent a confirmation to your registered email.
      </p>

      <div className="flex flex-wrap gap-4 justify-center w-full">
        <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white" asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
