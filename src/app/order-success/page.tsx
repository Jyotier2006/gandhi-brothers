import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Successful | Gandhi Brothers",
  description: "Your order at Gandhi Brothers has been confirmed.",
};

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <CheckCircle2 className="h-20 w-20 mx-auto text-green-600 mb-6" />
      
      <h1 className="text-3xl md:text-4xl font-sans font-semibold text-ink mb-4">
        Thank you for your order
      </h1>
      
      <p className="text-ink/80 font-serif text-lg mb-4">
        Your payment has been verified and your order is confirmed.
      </p>

      {orderId && (
        <p className="text-ink font-medium bg-cream border border-ink-100 rounded-lg px-4 py-2 mx-auto inline-block mb-4">
          Order reference: <span className="font-mono text-terracotta ml-1">{orderId}</span>
        </p>
      )}

      <p className="text-ink/60 text-sm max-w-sm mx-auto mb-8">
        We've recorded your details. A confirmation will follow on your registered email and phone.
      </p>

      <div className="flex flex-wrap gap-3 justify-center w-full">
        <Button size="lg" asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
