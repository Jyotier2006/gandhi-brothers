"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "Small Retailers & Clinics",
    moq: "₹25,000 / month",
    perks: ["5% off MRP", "Priority dispatch", "Dedicated account manager"],
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    subtitle: "Distributors & Chains",
    moq: "₹75,000 / month",
    perks: [
      "12% off MRP",
      "Same-day dispatch (Ahmedabad)",
      "Custom labelling option",
      "Monthly credit facility",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "Pan-India Wholesale",
    moq: "₹2,00,000 / month",
    perks: [
      "18% off MRP",
      "White-label / private label",
      "Dedicated logistics support",
      "Flexible NET-30 terms",
    ],
    highlight: false,
  },
];

const PRODUCT_OPTIONS = [
  "Churnas",
  "Capsules",
  "Arishtas",
  "Mixed (All Categories)",
  "Other",
];

const VOLUME_OPTIONS = [
  "₹25,000 – ₹74,999 / month",
  "₹75,000 – ₹1,99,999 / month",
  "₹2,00,000+ / month",
];

interface FormState {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  productInterest: string;
  estimatedMonthlyVolume: string;
  message: string;
  tier: string;
}

const INITIAL: FormState = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  productInterest: "",
  estimatedMonthlyVolume: "",
  message: "",
  tier: "",
};

export default function BulkOrderForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/bulk-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setSuccessId(data.inquiryId);
      setForm(INITIAL);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-14">
      {/* ── Tier Cards ── */}
      <section>
        <h2 className="text-2xl font-bold text-[#4A3F35] mb-2 text-center">
          Choose Your Tier
        </h2>
        <p className="text-center text-[#A69279] text-sm mb-8">
          Select the tier that best matches your expected monthly order value.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, tier: tier.name }))}
              className={cn(
                "relative rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                form.tier === tier.name
                  ? tier.highlight
                    ? "border-[#D4A351] bg-[#D4A351]/10 shadow-md shadow-[#D4A351]/20"
                    : "border-[#A69279] bg-[#A69279]/8 shadow-md shadow-[#A69279]/20"
                  : "border-[#A69279]/20 bg-white hover:border-[#A69279]/50"
              )}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#A69279] to-[#D4A351] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </span>
              )}
              {form.tier === tier.name && (
                <span className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A351]">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <p className="text-lg font-bold text-[#4A3F35]">{tier.name}</p>
              <p className="text-xs text-[#A69279] mb-3">{tier.subtitle}</p>
              <p className="text-sm font-semibold text-[#D4A351] mb-4">
                MOV: {tier.moq}
              </p>
              <ul className="space-y-1.5">
                {tier.perks.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-xs text-[#4A3F35]/80"
                  >
                    <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-[#D4A351]/20 text-[#D4A351] flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </section>

      {/* ── Inquiry Form ── */}
      <section>
        <h2 className="text-2xl font-bold text-[#4A3F35] mb-2 text-center">
          Submit Your Inquiry
        </h2>
        <p className="text-center text-[#A69279] text-sm mb-8">
          We respond to all wholesale inquiries within 1–2 business days.
        </p>

        {successId ? (
          <div className="max-w-lg mx-auto rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-green-800 mb-1">
              Inquiry Received!
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Our team will be in touch within 1–2 business days.
            </p>
            <p className="text-xs text-green-600 font-mono bg-green-100 px-3 py-1.5 rounded-lg inline-block">
              Reference: {successId}
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSuccessId(null)}
              >
                Submit Another Inquiry
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-5"
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company / Business Name *">
                <input
                  required
                  value={form.companyName}
                  onChange={set("companyName")}
                  placeholder="Gandhi Pharma Pvt Ltd"
                  className={inputCls}
                />
              </Field>
              <Field label="Contact Person *">
                <input
                  required
                  value={form.contactName}
                  onChange={set("contactName")}
                  placeholder="Rajesh Gandhi"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Business Email *">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="rajesh@company.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Phone / WhatsApp *">
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Products of Interest *">
                <select
                  required
                  value={form.productInterest}
                  onChange={set("productInterest")}
                  className={inputCls}
                >
                  <option value="">Select…</option>
                  {PRODUCT_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Est. Monthly Volume *">
                <select
                  required
                  value={form.estimatedMonthlyVolume}
                  onChange={set("estimatedMonthlyVolume")}
                  className={inputCls}
                >
                  <option value="">Select…</option>
                  {VOLUME_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Tier hidden field reminder */}
            {!form.tier && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                💡 Select a tier above before submitting.
              </p>
            )}

            {/* Message */}
            <Field label="Additional Message (optional)">
              <textarea
                rows={4}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell us more about your business, specific requirements, or questions…"
                className={cn(inputCls, "resize-none")}
              />
            </Field>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting || !form.tier}
              className="w-full"
            >
              {submitting ? "Submitting…" : "Submit Wholesale Inquiry"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#4A3F35]/70 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#A69279]/25 bg-white px-4 py-2.5 text-sm text-[#4A3F35] placeholder:text-[#A69279]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A351]/40 focus:border-[#D4A351]/60 transition-all";
