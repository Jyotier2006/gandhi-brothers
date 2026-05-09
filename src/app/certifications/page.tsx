/**
 * Certifications page — display all regulatory and quality credentials.
 *
 * Path: src/app/certifications/page.tsx → /certifications
 *
 * High trust value — customers and B2B buyers check this page to verify
 * legitimacy before placing orders.
 */
import Link from 'next/link';
import { ShieldCheck, FileCheck2, Award, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Certifications & Compliance — Gandhi Brothers',
  description:
    'FDCA Drug Manufacturing Licence GA/2079, Schedule T GMP compliance, classical Ayurvedic standards. Full regulatory documentation for Gandhi Brothers Ayurveda.',
};

const CREDENTIALS = [
  {
    icon: FileCheck2,
    label: 'FDCA Drug Manufacturing Licence',
    value: 'GA/2079',
    detail:
      'Form 25D issued by the Food and Drug Control Administration, Gujarat State. Authorises manufacture of Ayurvedic medicines, including churnas, tablets, capsules, asavas, arishtas, tailas, and external preparations.',
  },
  {
    icon: ShieldCheck,
    label: 'Schedule T GMP Compliance',
    value: 'Maintained',
    detail:
      'Manufacturing facility operates under Schedule T of the Drugs and Cosmetics Rules — Good Manufacturing Practices for Ayurvedic, Siddha, and Unani medicines. Documented batch records, validated processes, qualified technical staff.',
  },
  {
    icon: Award,
    label: 'Schedule TA & U(I)',
    value: 'Compliant',
    detail:
      'Records maintained per Schedule TA (Standards for Ayurvedic, Siddha and Unani drugs) and Schedule U(I) (Particulars to be shown in manufacturing records). Raw material register, batch manufacturing record, finished goods register, and quality control records updated for every batch.',
  },
  {
    icon: Factory,
    label: 'FDCA-Approved Facility',
    value: 'Junagadh',
    detail:
      'Three-floor purpose-built manufacturing facility approved by FDCA Gujarat State. Separate zones for raw material storage, manufacturing (churnas, tablets, capsules, oils, external preparations), QC laboratory with retain sample room, and packing/labelling.',
  },
];

const FORMULATION_STANDARDS = [
  {
    title: 'Classical formulations',
    body:
      'Prepared per Charaka Samhita, Sharangdhar Samhita, Bhaishajya Ratnavali, and other recognised classical texts. Method, proportions, and processing follow textual specifications.',
  },
  {
    title: 'Proprietary formulations',
    body:
      'Filed and approved with FDCA per Schedule T requirements. Each proprietary product carries a documented composition, manufacturing standard, and stability profile.',
  },
  {
    title: 'Quality control',
    body:
      'Identity testing of raw materials, in-process checks during manufacturing, finished goods analysis. Retain samples preserved per regulatory requirements.',
  },
];

export default function CertificationsPage() {
  return (
    <main className="bg-cream min-h-screen">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <p className="text-xs text-terracotta font-medium uppercase tracking-[0.2em] mb-3">
          Certifications &amp; Compliance
        </p>
        <h1
          className="text-3xl md:text-5xl font-semibold text-ink mb-4"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Documented at every step.
        </h1>
        <div className="terracotta-rule" />
        <p className="text-ink-400 max-w-2xl mx-auto leading-relaxed">
          Every formulation we manufacture is backed by regulatory documentation,
          quality testing, and traceable batch records. Below is the public
          register of our credentials.
        </p>
      </section>

      {/* CREDENTIALS GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CREDENTIALS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="bg-white border border-ink-100 rounded-xl p-6 md:p-7 hover:border-terracotta transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cream shrink-0">
                    <Icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-terracotta uppercase tracking-wider font-medium">
                      {c.label}
                    </p>
                    <p
                      className="text-xl md:text-2xl font-semibold text-ink mt-1"
                      style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
                    >
                      {c.value}
                    </p>
                    <p className="text-sm text-ink-400 leading-relaxed mt-2">
                      {c.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FORMULATION STANDARDS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-xs text-terracotta font-medium uppercase tracking-[0.2em] mb-3">
            Manufacturing Standards
          </p>
          <h2
            className="text-2xl md:text-3xl font-semibold text-ink"
            style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
          >
            How we make what we make.
          </h2>
          <div className="terracotta-rule" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FORMULATION_STANDARDS.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-ink-100 rounded-xl p-6"
            >
              <h3
                className="text-lg font-semibold text-ink mb-2"
                style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
              >
                {s.title}
              </h3>
              <p className="text-sm text-ink-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANY DETAILS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-10">
          <h2
            className="text-xl font-semibold text-ink mb-1"
            style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
          >
            Legal &amp; corporate details
          </h2>
          <hr className="border-ink-100 mb-5" />

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="text-ink-400 uppercase text-xs tracking-wider mb-1">
                Legal Entity
              </dt>
              <dd className="text-ink font-medium">Gandhi Brothers</dd>
              <dd className="text-ink-400 text-xs mt-0.5">Partnership Firm, est. 2023</dd>
            </div>

            <div>
              <dt className="text-ink-400 uppercase text-xs tracking-wider mb-1">
                PAN
              </dt>
              <dd className="text-ink font-medium">AAMFG2812L</dd>
            </div>

            <div>
              <dt className="text-ink-400 uppercase text-xs tracking-wider mb-1">
                Drug Manufacturing Licence
              </dt>
              <dd className="text-ink font-medium">GA/2079 (Form 25D)</dd>
              <dd className="text-ink-400 text-xs mt-0.5">FDCA, Government of Gujarat</dd>
            </div>

            <div>
              <dt className="text-ink-400 uppercase text-xs tracking-wider mb-1">
                Manufacturing Address
              </dt>
              <dd className="text-ink">
                Gomti Bhavan, Azad Chowk
                <br />
                Junagadh, Gujarat &mdash; 362001
              </dd>
            </div>
          </dl>

          <p className="text-xs text-ink-400 mt-8 pt-6 border-t border-ink-100">
            Documentation copies (drug licence, GMP certificate) are available on
            verified business request to{' '}
            <a
              href="mailto:support@gandhibrothers.co.in"
              className="text-terracotta hover:underline"
            >
              support@gandhibrothers.co.in
            </a>
            . For regulatory queries, please include your business details and
            purpose of request.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <h2
          className="text-2xl md:text-3xl font-semibold text-ink mb-3"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Questions about our compliance?
        </h2>
        <p className="text-ink-400 mb-6">
          We&apos;re happy to share certificate copies with verified buyers,
          clinics, and regulatory bodies.
        </p>
        <Link href="/contact">
          <Button size="lg">Contact us</Button>
        </Link>
      </section>
    </main>
  );
}
