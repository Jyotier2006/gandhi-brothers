/**
 * About Us page — short brand story, mission, what makes Gandhi Brothers different.
 *
 * Path: src/app/about/page.tsx → /about
 *
 * Design philosophy:
 * - Editorial, calm, brand-aligned (cream background, terracotta accents)
 * - Real specifics over generic marketing language
 * - 3 sections: Story (short), Principles (3 cards), CTA
 */
import Link from 'next/link';
import { Leaf, ShieldCheck, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About — Three Generations of Ayurveda in Junagadh',
  description:
    'Three generations of authentic Ayurvedic practice from Junagadh, Gujarat. FDCA-licensed manufacturing, classical formulations, modern accountability.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Gandhi Brothers — Ayurveda in Junagadh since 1950',
    description:
      'Three generations of authentic Ayurvedic practice from Junagadh, Gujarat. FDCA-licensed manufacturing and classical formulations.',
    url: '/about',
  },
};

const PRINCIPLES = [
  {
    icon: Leaf,
    title: 'Authentic at source',
    body: 'Raw materials sourced from verified suppliers, identified by classical Sanskrit names, tested before each batch. No substitutes, no shortcuts.',
  },
  {
    icon: BookOpen,
    title: 'Classical, not casual',
    body: 'Formulations follow textual references — Charaka Samhita, Sharangdhar Samhita, Bhaishajya Ratnavali. Where the texts demand a method, that method is what we use.',
  },
  {
    icon: ShieldCheck,
    title: 'Documented, accountable',
    body: 'Every batch is documented end-to-end: raw material origin, processing steps, quality checks, finished goods. FDCA Drug Manufacturing Licence GA/2079.',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-cream min-h-screen">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <p className="text-xs text-terracotta font-medium uppercase tracking-[0.2em] mb-3">
          About Us
        </p>
        <h1
          className="text-3xl md:text-5xl font-semibold text-ink mb-4"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Made the right way, in the right place.
        </h1>
        <div className="terracotta-rule" />
        <p className="text-ink-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
          Gandhi Brothers is a family-run Ayurvedic manufacturing firm in
          Junagadh, Gujarat. Our work is the continuation of an apothecary
          tradition our grandfather started in 1950 — careful, classical, and
          uncompromising about what goes into a finished medicine.
        </p>
      </section>

      {/* STORY — short, two paragraphs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-10 leading-relaxed text-ink space-y-4">
          <p>
            Three generations of our family have practised Ayurvedic dispensing
            from a small shop at Panchatdi Chowk, Junagadh. What began as JGV in
            1950 — Jamnadas Gordhandas Vithalani&rsquo;s apothecary serving the
            local community — grew into a regional reputation for authentic raw
            materials and faithfully prepared formulations.
          </p>
          <p>
            In 2023, we established <strong>Gandhi Brothers</strong> as a
            licensed manufacturing partnership at Gomti Bhavan, Azad Chowk. The
            heritage is the same; the operation is now built for the standards
            of modern Ayurveda — full FDCA compliance, batch traceability, and
            verified quality testing for every product that leaves our facility.
            Our 58 formulations span proprietary preparations, classical
            compound formulations, and single-herb materia medica.
          </p>
          <p className="text-ink-400 text-sm pt-2">
            <Link href="/heritage" className="text-terracotta hover:underline">
              Read our full heritage →
            </Link>
          </p>
        </div>
      </section>

      {/* THREE PRINCIPLES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-xs text-terracotta font-medium uppercase tracking-[0.2em] mb-3">
            What we stand for
          </p>
          <h2
            className="text-2xl md:text-3xl font-semibold text-ink"
            style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
          >
            Three principles, no compromises.
          </h2>
          <div className="terracotta-rule" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white border border-ink-100 rounded-xl p-6 hover:border-terracotta hover:shadow-md transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cream mb-4">
                  <Icon className="w-6 h-6 text-terracotta" />
                </div>
                <h3
                  className="text-lg font-semibold text-ink mb-2"
                  style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FACTS STRIP */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: '1950', l: 'Founded' },
              { v: '58', l: 'Formulations' },
              { v: 'GA/2079', l: 'FDCA Licence' },
              { v: '3', l: 'Generations' },
            ].map((f) => (
              <div key={f.l}>
                <div
                  className="text-2xl md:text-3xl font-semibold text-terracotta"
                  style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
                >
                  {f.v}
                </div>
                <div className="text-xs text-ink-400 mt-1 uppercase tracking-wider">
                  {f.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <p className="text-xs text-terracotta font-medium uppercase tracking-[0.2em] mb-3">
          Continue
        </p>
        <h2
          className="text-2xl md:text-3xl font-semibold text-ink mb-4"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Browse our formulations.
        </h2>
        <div className="terracotta-rule" />
        <p className="text-ink-400 max-w-xl mx-auto leading-relaxed mb-6">
          Single-herb churnas, classical compound preparations, and proprietary
          formulations &mdash; all manufactured at our Junagadh facility.
        </p>
        <Link href="/products">
          <Button size="lg">View all products</Button>
        </Link>
      </section>
    </main>
  );
}
