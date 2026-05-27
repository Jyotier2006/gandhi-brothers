import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description:
    "Gandhi Brothers' policy on returns, replacements, and refunds for Ayurvedic products purchased online.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Returns Policy"
      updated="21 May 2026"
      intro="Your trust matters to us. Because our products are consumable Ayurvedic preparations, returns are handled carefully and in line with safety norms. Please read the conditions below."
    >
      <LegalSection heading="When you can return an item">
        <p>We accept returns or offer a replacement in these cases:</p>
        <ul>
          <li>The product arrived damaged, leaking, or broken.</li>
          <li>You received the wrong item or an incorrect pack size.</li>
          <li>The product was past its “best used by” date on arrival, or the seal was broken on delivery.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="What cannot be returned">
        <p>
          For hygiene and safety reasons, opened or used products cannot be returned unless they were defective on
          arrival. We are unable to accept returns based on a change of mind once a sealed product has been delivered in
          good condition.
        </p>
      </LegalSection>

      <LegalSection heading="How to raise a request">
        <ul>
          <li>Contact us within <strong>48 hours</strong> of delivery at support@gandhibrothers.co.in or +91 91069 80909.</li>
          <li>Share your order reference and clear photos of the product and packaging.</li>
          <li>Our team will review and confirm the next steps, usually within 2 business days.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Refunds">
        <p>
          Once a return is approved and (where applicable) the item is received back, we process your refund to the
          original payment method via Razorpay. Refunds typically reflect in your account within 5–7 business days,
          depending on your bank. Original shipping charges are non-refundable unless the return was due to our error.
        </p>
      </LegalSection>

      <LegalSection heading="Replacements">
        <p>
          If you prefer a replacement instead of a refund for a damaged or incorrect item, we will ship the correct
          product at no extra cost once your request is approved.
        </p>
      </LegalSection>

      <LegalSection heading="Order cancellation">
        <p>
          You may request a cancellation before your order is dispatched for a full refund. Once an order has shipped,
          it can no longer be cancelled, but the return conditions above may still apply.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
