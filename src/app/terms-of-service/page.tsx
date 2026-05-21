import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions for using the Gandhi Brothers website and purchasing our Ayurvedic products.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="21 May 2026"
      intro="These terms govern your use of gandhibrothers.co.in and any purchase you make from us. By using the site or placing an order, you agree to these terms."
    >
      <LegalSection heading="About us">
        <p>
          Gandhi Brothers is an FDCA-licensed Ayurvedic manufacturer based at Gomti Bhavan, Azad Chowk, Junagadh –
          362001, Gujarat, India (Manufacturing Licence GA/2079, Form 25D).
        </p>
      </LegalSection>

      <LegalSection heading="Products &amp; information">
        <p>
          We make every effort to describe our products and display prices accurately. Pack sizes, ingredients, and
          usage directions are printed on each pack. Product images are representative; actual packaging may vary.
        </p>
      </LegalSection>

      <LegalSection heading="Health &amp; usage disclaimer">
        <p>
          Our products are Ayurvedic preparations and are not intended to diagnose, treat, cure, or prevent any disease.
          They are best used under the guidance of a qualified Ayurvedic physician. If you are pregnant, breastfeeding,
          or taking other medication, please consult your physician before use. The information on this site is for
          general purposes and is not a substitute for professional medical advice.
        </p>
      </LegalSection>

      <LegalSection heading="Orders &amp; pricing">
        <ul>
          <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes unless stated otherwise.</li>
          <li>An order is confirmed only after successful payment and our acceptance.</li>
          <li>We may cancel an order and refund you in full if an item is unavailable, mispriced, or if we suspect fraud.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Payments">
        <p>
          Payments are processed securely by Razorpay. By paying, you confirm you are authorised to use the chosen
          payment method. We do not store your card or banking details.
        </p>
      </LegalSection>

      <LegalSection heading="Shipping, returns &amp; refunds">
        <p>
          Delivery, returns, and refunds are governed by our{" "}
          <a href="/shipping-policy">Shipping Policy</a> and <a href="/refund-policy">Refund &amp; Returns Policy</a>,
          which form part of these terms.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          You agree not to misuse the site, attempt to disrupt it, or use it for any unlawful purpose. All content,
          logos, and product copy on this site are owned by Gandhi Brothers and may not be copied without permission.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the extent permitted by law, our liability for any claim arising from a purchase is limited to the amount
          you paid for the relevant order. We are not liable for indirect or consequential losses.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the
          courts at Junagadh, Gujarat.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
