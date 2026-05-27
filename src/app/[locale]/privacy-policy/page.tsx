import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Gandhi Brothers collects, uses, and protects your personal information when you shop with us.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="21 May 2026"
      intro="Gandhi Brothers (“we”, “us”, “our”) respects your privacy. This policy explains what information we collect when you visit gandhibrothers.co.in or place an order, and how we use and protect it."
    >
      <LegalSection heading="Information we collect">
        <p>We collect only what we need to fulfil your order and run our store:</p>
        <ul>
          <li><strong>Contact &amp; delivery details</strong> — your name, email, phone number, and shipping address.</li>
          <li><strong>Order details</strong> — the products you buy, order value, and delivery PIN code.</li>
          <li><strong>Payment information</strong> — handled entirely by our payment partner (Razorpay). We never see or store your full card, UPI, or bank details.</li>
          <li><strong>Device &amp; usage data</strong> — basic, anonymised information your browser sends (such as pages visited), used to keep the site working and secure.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use your information">
        <ul>
          <li>To process, pack, ship, and confirm your orders.</li>
          <li>To send order and shipping updates by email and SMS.</li>
          <li>To respond to your enquiries and provide customer support.</li>
          <li>To meet our legal, tax, and FDCA record-keeping obligations.</li>
        </ul>
        <p>We do not sell your personal information to anyone.</p>
      </LegalSection>

      <LegalSection heading="Who we share it with">
        <p>We share information only with trusted partners who help us run the store, and only as needed:</p>
        <ul>
          <li><strong>Razorpay</strong> — to process payments securely.</li>
          <li><strong>Shiprocket and our courier partners</strong> — to deliver your order and provide tracking.</li>
          <li>Service providers that host our website and send transactional email.</li>
        </ul>
        <p>These partners are bound to use your data only for the services they provide to us.</p>
      </LegalSection>

      <LegalSection heading="Cookies &amp; local storage">
        <p>
          We use your browser&apos;s local storage to remember your cart and wishlist between visits. These stay on your
          device and are not personal-tracking cookies. You can clear them any time from your browser settings.
        </p>
      </LegalSection>

      <LegalSection heading="Data security &amp; retention">
        <p>
          Payments are encrypted and processed by Razorpay over secure connections. We retain order records for as long
          as required for accounting, warranty, and statutory compliance, after which they are securely removed.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          You may ask us to access, correct, or delete the personal information we hold about you, subject to records we
          must keep by law. To make a request, contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          We may update this policy from time to time. The “Last updated” date above reflects the most recent change.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
