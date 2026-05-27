import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Heritage — 75 Years of Ayurveda in Junagadh",
  description: "Three generations, seventy-five years, one family. The story of JGV and Gandhi Brothers Ayurvedic practice in Junagadh since 1950.",
  alternates: { canonical: "/heritage" },
  openGraph: {
    title: "Our Heritage — Gandhi Brothers Ayurveda since 1950",
    description: "Three generations, seventy-five years, one family. The story of JGV and Gandhi Brothers in Junagadh.",
    url: "/heritage",
  },
};

const TIMELINE_ENTRIES = [
  {
    year: "1950",
    image: "/heritage/heritage-1950-house-at-girnar.png",
    eyebrow: "FOUNDATION",
    title: "A house at the foot of Girnar",
    body: "In 1950, in a city whose Ayurvedic tradition has been carried by its vaidyas, herbalists, and trading houses for more than two thousand years, Jamnadas Gordhandas Vithalani opened a small Ayurvedic dispensing and raw-material house at the foot of Mount Girnar. He weighed out raw dravyas on brass balances, hand-selected churnas, and sourced classical preparations from across Saurashtra and Kutch. There was no signage announcing it. Everyone in the neighbourhood knew where to go.",
  },
  {
    year: "1950 – 1973",
    image: "/heritage/heritage-1950-1973-first-25-years.png",
    eyebrow: "LEGACY",
    title: "The first twenty-five years",
    body: "For a quarter-century the work was almost entirely retail. Whole haritaki came in by the sack from Kathiawar, ashwagandha root from Mandvi, vidanga from the Western Ghats. Each lot was stored, identified, weighed, twisted into paper packets, and handed across the counter — the same trade that had been done on the same lanes for centuries. The house's reputation was built on what it refused to keep: any dravya that didn't match in colour, scent, taste, or fracture went back where it came from.",
  },
  {
    year: "1974 – 1989",
    image: "/heritage/heritage-1974-1989-hands-before-machines.png",
    eyebrow: "INNOVATION",
    title: "Hands before machines",
    body: "By the mid-1970s a quiet problem had become impossible to ignore. Customers were buying whole herbs in good faith, then carrying them home and finding they had neither the time, the tools, nor the patience to powder them properly. A churna prepared badly at home is an Ayurvedic preparation wasted. So our grandmother took up the work herself. From 1974 to 1989, for fifteen years, she ground herbs by hand — with stone mortar and pestle, in the slow, unhurried rhythm that classical preparation actually requires. She finished what the customer had paid for, and then handed it back ready to use. This was household service work — a dispensing house's most patient hand — long before any manufacturing licence existed in the family's name.",
  },
  {
    year: "Late 1980s",
    image: "/heritage/heritage-late-1980s-first-machine.png",
    eyebrow: "PROGRESS",
    title: "The first machine",
    body: "Toward the end of the 1980s the demand had grown beyond what one person could do. The family bought its first mechanical pulverizer. The churnas her hands had been making for years — Triphala, ashwagandha, vidanga, Sitopaladi — now came off a motor instead of a stone. The preparation did not change. The throughput did. For the first time, pre-powdered churnas could be offered as a regular line, rather than a favour.",
  },
  {
    year: "1998 – 1999",
    image: "/heritage/heritage-1998-1999-sealed-pouch.png",
    eyebrow: "PACKAGING",
    title: "A sealed pouch",
    body: "A decade later came the second turning point. Around 1998–99, the family bought its first hand band sealer. Until then, churnas had gone out the way they always had — in folded paper twists, sometimes a glass jar for regular customers. The band sealer changed everything: powders could now be filled, sealed, dated, and stocked. Shelf life had a meaning. Pouches could travel further than walking distance. The dispensing house, almost without anyone announcing it, had begun to look like something more.",
  },
  {
    year: "25 July 2013",
    image: "/heritage/heritage-2013-licensed-manufacturer.png",
    eyebrow: "REGULATION",
    title: "A licensed manufacturer",
    body: "On 25 July 2013, brothers Kimpal and Atul Rasiklal Vithlani — inheritors of the lineage Jamnadas began — formalised what the family had been doing informally for forty years. They founded Gandhi Brothers as a registered Ayurvedic manufacturing partnership and applied for Form 25D under the Drugs and Cosmetics Rules, 1945. The licence — GA/2079 — was issued by the Food and Drugs Control Administration (FDCA), Gujarat, granting them legal authority to manufacture Ayurvedic medicines and Ayurvedic cosmetics for sale across India. Household preparation had become a documented, inspected, accountable manufacturing operation.",
  },
  {
    year: "October 2023",
    image: "/heritage/heritage-2023-factory-gomti-bhavan.png",
    eyebrow: "EXPANSION",
    title: "The factory at Gomti Bhavan",
    body: "The work is now done from a four-floor facility at Gomti Bhavan, Azad Chowk, Junagadh, approved by the Joint Commissioner (Ayurved), FDCA Gujarat in October 2023 under plan reference Plan/GANDHI/2023/63082/D/Ayu. The plant now carries the equipment the family did not have for the first forty years of its life — pulverizer, vibro sifter, fifty-kilogram mass mixer, thirty-kilogram fluid bed dryer, twenty-station compression machine — along with the workflows that come with them: raw-material identification, batch manufacturing records, in-process quality control, and finished-product release. The approved scope of manufacture covers Churna, Tablet, Capsule, Oil, Ghrit, and External Preparations, alongside Ayurvedic cosmetics — Hair Oil, Cream, Lotion, Shampoo, and Powder.",
  },
  {
    year: "Today",
    image: "/heritage/heritage-today-two-houses.png",
    eyebrow: "PRESENT",
    title: "Two houses, one lineage",
    body: "The two firms still work side by side. Jamnadas Gordhandas Vithalani (JGV), now a Hindu Undivided Family, continues as the family's raw-material and dispensing arm — the same trade it has done for seventy-five years. Gandhi Brothers stands as its manufacturing house. Raw materials sourced through JGV become finished Ayurvedic preparations through Gandhi Brothers, under a clear inter-entity documentation trail as required by FDCA Gujarat.",
  }
];

export default function HeritagePage() {
  return (
    <div className="bg-cream min-h-screen text-ink overflow-hidden pb-8">
      {/* ── Hero Section ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-xs text-terracotta uppercase tracking-[0.2em] font-medium mb-4">
          From Junagadh, since 1950
        </p>
        <h1
          className="text-4xl md:text-5xl lg:text-7xl font-semibold leading-tight text-ink"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Gandhi Brothers
        </h1>
        <div className="w-[60px] h-[2px] bg-terracotta mt-6 mb-6 mx-auto" />
        <p className="text-ink/80 max-w-2xl text-xl font-serif italic">
          Ayurvedic manufacturers — Junagadh, since 1950
        </p>
      </section>

      {/* ── Timeline Section ── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Spine Line */}
        <div className="absolute top-0 bottom-0 left-[24px] md:left-1/2 w-[1px] bg-ink/30 -translate-x-1/2 z-0" />

        <div className="relative z-10 flex flex-col space-y-12 md:space-y-16">
          {TIMELINE_ENTRIES.map((entry, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex items-center md:justify-between w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
              >
                {/* Era Marker */}
                <div className="absolute left-[24px] md:left-1/2 top-0 mt-8 md:top-1/2 md:mt-0 -translate-y-1/2 -translate-x-1/2 min-w-[80px] max-w-[120px] px-2 h-[32px] bg-terracotta rounded-md flex items-center justify-center z-20 shadow-sm border border-cream/20">
                  <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">{entry.year}</span>
                </div>

                {/* Desktop Spacer (to push the card to the correct side) */}
                <div className="hidden md:block w-[45%]" />

                {/* Timeline Card */}
                <div className={`w-[calc(100%-60px)] md:w-[45%] ml-[60px] md:ml-0 bg-white shadow-sm border border-ink-100 rounded-xl overflow-hidden will-change-transform`}>
                  {entry.image && (
                    <div className="h-48 sm:h-64 md:h-56 lg:h-64 w-full overflow-hidden relative bg-ink-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.image}
                        alt={entry.title}
                        className="object-cover w-full h-auto min-h-full"
                        loading="lazy"
                        style={{ filter: "grayscale(1) sepia(0.15) contrast(0.95)" }}
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <p className="text-xs text-terracotta uppercase tracking-[0.2em] font-medium mb-2">
                      {entry.eyebrow}
                    </p>
                    <h3
                      className="text-xl md:text-2xl font-semibold text-ink mt-1 mb-3"
                      style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
                    >
                      {entry.title}
                    </h3>
                    <p className="text-sm md:text-base text-ink-400 leading-relaxed">
                      {entry.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Closing Blocks ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col space-y-14 text-ink text-center md:text-left">
        <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-ink" style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}>
            What we make
          </h2>
          <p className="text-ink-400 leading-relaxed text-sm md:text-base">
            Across the catalogue, Gandhi Brothers produces fifty-eight distinct SKUs across fifty-two entries, organised in three sections: proprietary single-herb and combination preparations, classical polyherbal compounds prepared from the recognised Ayurvedic texts, and a base of single-herb churnas and capsules. Each preparation carries its own Batch Manufacturing Record, identity testing, and packaging line.
          </p>
        </div>

        <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-ink" style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}>
            The standards we hold ourselves to
          </h2>
          <p className="text-ink-400 leading-relaxed text-sm md:text-base">
            Every batch is prepared under Good Manufacturing Practice for Ayurvedic medicines (Schedule T, Drugs and Cosmetics Rules, 1945) and recorded under Schedule TA. The manufacturing licence is now perpetual under the Drugs (4th Amendment) Rules, 2021, subject to annual self-declaration of continued GMP compliance to FDCA Gujarat. Identity, purity, finish, labelling — each step is documented and open to inspection. The discipline is the same one our grandmother kept by hand, written down now in registers and signed by the partners.
          </p>
        </div>

        <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-ink" style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}>
            The generation that comes next
          </h2>
          <p className="text-ink-400 leading-relaxed text-sm md:text-base">
            The fourth generation of the family has begun its own apprenticeship. A son of the family is currently in his second professional year of the Bachelor of Ayurvedic Medicine and Surgery (BAMS) programme at the Government Ayurved College, Vadodara, under Gujarat Ayurved University, Jamnagar. The textbooks change. The lineage does not.
          </p>
        </div>
      </section>

      {/* ── Closing Line & Regulatory Footer ── */}
      <div className="max-w-3xl mx-auto px-4 mt-8 pb-16 text-center">
        <p className="italic text-2xl text-ink font-serif mb-16">
          From Junagadh, since 1950.
        </p>

        <div className="w-16 h-px bg-terracotta mx-auto mb-6" />
        <p className="text-xs text-ink/60 font-serif italic leading-relaxed mx-auto max-w-sm sm:max-w-xl">
          Gandhi Brothers is a partnership firm of Mr. Kimpal R. Vithlani and Mr. Atul R. Vithlani, licensed by the Food and Drugs Control Administration, Government of Gujarat (Form 25D, Licence GA/2079) to manufacture Ayurvedic medicines and Ayurvedic cosmetics.
        </p>
      </div>
    </div>
  );
}
