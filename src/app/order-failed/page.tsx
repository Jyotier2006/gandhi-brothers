import { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Failed | Gandhi Brothers",
  description: "Your recent payment was unsuccessful.",
};

interface OrderFailedPageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function OrderFailedPage({ searchParams }: OrderFailedPageProps) {
  const { reason } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <XCircle className="h-20 w-20 mx-auto text-red-600 mb-6" />
      
      <h1 className="text-3xl md:text-3xl font-sans font-bold text-ink mb-4">
        Payment unsuccessful
      </h1>
      
      <p className="text-ink/80 font-sans font-medium mb-6 bg-red-50 text-red-900 border border-red-100 rounded-lg px-4 py-3 mx-auto max-w-lg">
        {reason ? (
          <>Reason: {reason}</>
        ) : (
          <>Your payment did not complete. No charge was made if the amount has not been deducted.</>
        )}
      </p>

      <p className="text-ink/70 font-serif text-sm max-w-md mx-auto mb-8 leading-relaxed">
        If money has been debited from your account, it will be auto-refunded within 5–7 business days. For any concerns, contact <span className="font-semibold">support@gandhibrothers.co.in</span> or <span className="font-semibold">+91 9106980909</span> with your transaction reference.
      </p>

      <div className="flex flex-wrap gap-3 justify-center w-full">
        <Button size="lg" asChild>
          <Link href="/checkout">Retry payment</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/cart">Back to cart</Link>
        </Button>
      </div>
    </div>
  );
}
