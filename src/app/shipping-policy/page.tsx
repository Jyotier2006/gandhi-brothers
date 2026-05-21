import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "How and when Gandhi Brothers ships your Ayurvedic order across India, including charges and delivery timelines.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      updated="21 May 2026"
      intro="We ship our Ayurvedic preparations across India through reputed courier partners. Here is what to expect."
    >
      <LegalSection heading="Where we ship">
        <p>
          We currently deliver to serviceable PIN codes across India. You can check serviceability and live shipping
          charges for your area at checkout by entering your PIN code.
        </p>
      </LegalSection>

      <LegalSection heading="Shipping charges">
        <p>
          Shipping charges are calculated live at checkout based on your delivery PIN code and the weight of your order.
          The exact amount is shown before you pay, with no hidden fees.
        </p>
      </LegalSection>

      <LegalSection heading="Order processing">
        <ul>
          <li>Orders are usually processed and dispatched within 1–3 business days of payment confirmation.</li>
          <li>Orders placed on Sundays or public holidays are processed on the next business day.</li>
          <li>You will receive a confirmation email once your order is placed, and tracking details once it ships.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Delivery timelines">
        <p>
          Once dispatched, delivery typically takes 3–7 business days depending on your location. Remote or
          difficult-to-reach areas may take a little longer. These are estimates and not guaranteed, as final delivery
          depends on the courier.
        </p>
      </LegalSection>

      <LegalSection heading="Tracking your order">
        <p>
          When your order ships, we email you the courier name and AWB tracking number. You can also find tracking
          details on your order confirmation page.
        </p>
      </LegalSection>

      <LegalSection heading="Delays &amp; failed deliveries">
        <p>
          Occasionally, deliveries are delayed by weather, regional disruptions, or incorrect address details. If a
          shipment is returned to us because the address was incomplete or no one was available to receive it, we will
          contact you to arrange re-delivery (which may incur an additional shipping charge).
        </p>
      </LegalSection>

      <LegalSection heading="Damaged in transit">
        <p>
          If your parcel arrives damaged, please contact us within 48 hours of delivery with photos of the packaging
          and product so we can resolve it quickly. See our <a href="/refund-policy">Refund &amp; Returns Policy</a> for
          details.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
