import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Gandhi Brothers Ayurvedic products — authenticity, FDCA licensing, usage guidance, shipping, payments, and returns.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | Gandhi Brothers Ayurveda",
    description:
      "Common questions about Gandhi Brothers Ayurvedic products — authenticity, FDCA licensing, shipping, payments, and returns.",
    url: "/faq",
  },
};

/** Single source of truth: rendered Q&A and FAQPage JSON-LD are built from this. */
const FAQS: { q: string; a: string }[] = [
  {
    q: "Are Gandhi Brothers products authentic and licensed?",
    a: "Yes. Gandhi Brothers is an Ayurvedic manufacturer based in Junagadh, Gujarat, operating under FDCA Drug Manufacturing Licence GA/2079 (Form 25D). Every batch carries a traceable batch number and is prepared from carefully sourced raw materials.",
  },
  {
    q: "What is the difference between a Churna and a Taila?",
    a: "A Churna is a finely-ground herbal powder, and a Taila is a medicated oil prepared by slow-cooking herbs into a base oil. Both are classical Ayurvedic preparations; the right form depends on how you intend to use it and your physician's guidance.",
  },
  {
    q: "Should I consult a physician before using these products?",
    a: "We recommend it. Ayurvedic preparations are best used under the guidance of a qualified Ayurvedic physician, especially if you are pregnant, breastfeeding, or already taking other medication. Usage directions are printed on every pack.",
  },
  {
    q: "How are your products made?",
    a: "Our preparations are made in small, careful batches under our FDCA licence in Junagadh, following classical Ayurvedic methods and Schedule T good-manufacturing practices. Full composition is printed on each pack.",
  },
  {
    q: "Where do you deliver, and how long does it take?",
    a: "We ship across serviceable PIN codes in India through reputed courier partners. Orders are usually dispatched within 1–3 business days, and delivery typically takes 3–7 business days after dispatch. You can check live serviceability and charges at checkout.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Payments are processed securely through Razorpay, which supports UPI, credit and debit cards, and net banking. We never see or store your card or banking details.",
  },
  {
    q: "Can I return a product or get a refund?",
    a: "Because our products are consumable, returns apply to items that arrive damaged, incorrect, or with a broken seal. Contact us within 48 hours of delivery and we will arrange a refund or replacement. Full details are on our Refund & Returns Policy page.",
  },
  {
    q: "Do you offer wholesale or bulk pricing?",
    a: "Yes. For wholesale, practitioner, or bulk requirements (5 kg and above), please use our Inquiries page and we will route your request to the right desk.",
  },
  {
    q: "How should I store the products?",
    a: "Keep the pack tightly closed in a cool, dry place away from direct sunlight, and use within the period printed on the pack.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="relative min-h-screen pb-24">
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-cream to-transparent -z-10" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Breadcrumbs className="mb-8" items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

        <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink tracking-tight">
          Frequently Asked Questions
        </h1>
        <div className="h-1.5 w-16 bg-gradient-to-r from-terracotta to-mustard rounded-full mt-4" />
        <p className="mt-6 font-serif text-lg text-ink/75 leading-relaxed">
          Everything you might want to know before ordering. Can&apos;t find your answer?{" "}
          <Link href="/contact" className="text-terracotta font-semibold hover:underline">
            Get in touch
          </Link>
          .
        </p>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-ink-50 bg-white/70 backdrop-blur-sm shadow-sm transition-all hover:shadow-md open:shadow-md open:border-terracotta/20"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 list-none font-sans font-bold text-ink marker:hidden">
                <span>{f.q}</span>
                <span className="shrink-0 text-terracotta text-2xl leading-none transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1 font-serif text-ink/75 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="text-ink/40 font-semibold uppercase tracking-wider">Related:</span>
          <Link href="/shipping-policy" className="text-terracotta font-semibold hover:underline">Shipping Policy</Link>
          <Link href="/refund-policy" className="text-terracotta font-semibold hover:underline">Refund &amp; Returns</Link>
          <Link href="/certifications" className="text-terracotta font-semibold hover:underline">Certifications</Link>
          <Link href="/inquiry" className="text-terracotta font-semibold hover:underline">Wholesale Inquiries</Link>
        </div>
      </div>
    </div>
  );
}
