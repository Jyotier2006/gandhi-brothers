import type { Metadata } from "next";
import BulkOrderForm from "@/components/bulk-order-form";

export const metadata: Metadata = {
  title: "Wholesale / Bulk Orders | Gandhi Brothers",
  description:
    "Apply for a wholesale account with Gandhi Brothers — FDCA-licensed Ayurvedic manufacturers. Competitive pricing, dedicated support, and flexible terms for B2B partners.",
};

export default function BulkOrderPage() {
  return (
    <main className="min-h-screen bg-[#F9F7F3]">
      {/* ── Hero ── */}
      <section className="border-b border-[#A69279]/15 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block mb-4 text-xs font-bold tracking-widest uppercase text-[#D4A351] bg-[#D4A351]/10 px-4 py-1.5 rounded-full">
            B2B · Wholesale · Private Label
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4A3F35] leading-tight mb-4">
            Partner With Gandhi Brothers
          </h1>
          <p className="text-lg text-[#A69279] max-w-2xl mx-auto leading-relaxed">
            We supply premium FDCA-licensed Ayurvedic formulations to pharmacies,
            Ayurvedic clinics, distributors, and retail chains across India.
            Get preferential pricing, custom labelling, and dedicated account
            management.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#4A3F35]/70">
            {[
              "✦ FDCA Licensed · GA/2079",
              "✦ GMP Certified Facility",
              "✦ 50+ SKUs Available",
              "✦ Pan-India Delivery",
            ].map((item) => (
              <span key={item} className="font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content (Tier Cards + Form) ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BulkOrderForm />
      </section>

      {/* ── Trust Strip ── */}
      <section className="border-t border-[#A69279]/15 bg-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-[#A69279] font-semibold uppercase tracking-widest mb-6">
            Why Partner With Us
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🏭", title: "Own Manufacturing", desc: "No middlemen — direct from our facility" },
              { icon: "📋", title: "FDCA Licensed", desc: "Fully compliant formulations" },
              { icon: "🚚", title: "Fast Dispatch", desc: "Same-day for Ahmedabad partners" },
              { icon: "🤝", title: "Flexible Terms", desc: "NET-30 for Enterprise accounts" },
            ].map((card) => (
              <div key={card.title} className="space-y-1.5">
                <div className="text-3xl">{card.icon}</div>
                <p className="font-bold text-[#4A3F35] text-sm">{card.title}</p>
                <p className="text-xs text-[#A69279]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
