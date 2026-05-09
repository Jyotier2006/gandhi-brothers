/**
 * Contact Us page — info + simple message form.
 *
 * Path: src/app/contact/page.tsx → /contact
 */
import { Phone, Mail, MapPin, Instagram, Clock } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

export const metadata = {
  title: 'Contact Us — Gandhi Brothers',
  description:
    'Get in touch with Gandhi Brothers, Junagadh. Phone, email, and a contact form for product, order, and wholesale enquiries.',
};

export default function ContactPage() {
  return (
    <main className="bg-cream min-h-screen">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <p className="text-xs text-terracotta font-medium uppercase tracking-[0.2em] mb-3">
          Contact Us
        </p>
        <h1
          className="text-3xl md:text-5xl font-semibold text-ink mb-4"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          We&rsquo;d love to hear from you.
        </h1>
        <div className="terracotta-rule" />
        <p className="text-ink-400 max-w-xl mx-auto leading-relaxed">
          Questions about a product, an order, regulatory documentation, or
          anything else &mdash; reach out and we&rsquo;ll respond within 1
          business day.
        </p>
      </section>

      {/* TWO-COLUMN: contact info + form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* INFO PANEL */}
          <div className="lg:col-span-2 space-y-4">
            <ContactInfoCard
              icon={Phone}
              label="Call us"
              detail={
                <a
                  href="tel:+919106980909"
                  className="text-ink hover:text-terracotta transition-colors"
                >
                  +91 9106 9809 09
                </a>
              }
              hint="Mon-Sat, 10:00 AM - 7:00 PM IST"
            />

            <ContactInfoCard
              icon={Mail}
              label="Email us"
              detail={
                <a
                  href="mailto:support@gandhibrothers.co.in"
                  className="text-ink hover:text-terracotta transition-colors break-all"
                >
                  support@gandhibrothers.co.in
                </a>
              }
              hint="We typically reply within 24 hours"
            />

            <ContactInfoCard
              icon={MapPin}
              label="Visit our manufacturing facility"
              detail={
                <span className="text-ink leading-relaxed">
                  Gomti Bhavan, Azad Chowk
                  <br />
                  Junagadh, Gujarat &mdash; 362001
                </span>
              }
              hint="By appointment only"
            />

            <ContactInfoCard
              icon={Instagram}
              label="Follow on Instagram"
              detail={
                <a
                  href="https://instagram.com/gandhi_brothers9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-terracotta transition-colors"
                >
                  @gandhi_brothers9
                </a>
              }
            />

            <div className="bg-cream-light border border-ink-100 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-ink mb-1">
                    For urgent order issues
                  </p>
                  <p className="text-sm text-ink-400 leading-relaxed">
                    Call us directly at the number above. For non-urgent
                    questions, email or the form below works best.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM PANEL */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-8">
              <h2
                className="text-xl font-semibold text-ink mb-1"
                style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
              >
                Send us a message
              </h2>
              <p className="text-sm text-ink-400 mb-6">
                For wholesale or bulk enquiries, please use our{' '}
                <a href="/bulk-order" className="text-terracotta hover:underline">
                  bulk order form
                </a>{' '}
                instead.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactInfoCard({
  icon: Icon,
  label,
  detail,
  hint,
}: {
  icon: any;
  label: string;
  detail: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-ink-100 rounded-xl p-5 hover:border-terracotta transition-colors">
      <div className="flex items-start gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cream shrink-0">
          <Icon className="w-5 h-5 text-terracotta" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-ink-400 uppercase tracking-wider font-medium mb-1">
            {label}
          </p>
          <div className="text-sm font-medium">{detail}</div>
          {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
