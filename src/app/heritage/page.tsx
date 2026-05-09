import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Heritage | Gandhi Brothers",
  description: "Three generations, seventy-five years, one family. The story of JGV and Gandhi Brothers Ayurvedic practice since 1950.",
};

const TIMELINE_ENTRIES = [
  {
    year: "1950",
    image: "https://images.unsplash.com/photo-1542406775-ada59eecf848?auto=format&fit=crop&q=80&w=600&h=450",
    eyebrow: "FOUNDATION",
    title: "The First Apothecary",
    body: "Jamnadas Gordhandas Vithalani opened the doors of JGV at Panchatdi Chowk, opposite the Ram Mandir in Junagadh. A small dispensing shop where every formulation was hand-compounded and every raw material chosen with care. The principles set then — authenticity over scale, integrity over volume — still guide us today.",
  },
  {
    year: "1960s",
    image: "https://images.unsplash.com/photo-1596752002519-74fccdcda976?auto=format&fit=crop&q=80&w=600&h=450",
    eyebrow: "LEGACY",
    title: "Trust Across Saurashtra",
    body: "Word travelled. Practitioners from across Saurashtra came to JGV for authentic dravya — the genuine raw materials that classical Ayurveda demands. Three families could be served from the same counter on a busy afternoon, each treated with the same patient explanation.",
  },
  {
    year: "1980s",
    image: "https://images.unsplash.com/photo-1615592389070-bcc97e050487?auto=format&fit=crop&q=80&w=600&h=450",
    eyebrow: "INNOVATION",
    title: "Standardising Quality",
    body: "The second generation joined the practice and brought rigorous quality protocols — verified raw material sourcing, batch documentation, careful supplier relationships. Tradition was preserved; consistency was added. The reputation that JGV held locally now extended across Gujarat.",
  },
  {
    year: "2000s",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=600&h=450",
    eyebrow: "REGULATION",
    title: "Records and Compliance",
    body: "Formalised record-keeping, regulatory documentation, and traceable sourcing became part of daily practice. JGV's compounding work served clinics, panchakarma centres, and individual practitioners — each batch identifiable, each raw material accountable.",
  },
  {
    year: "2023",
    image: "https://images.unsplash.com/photo-1629904853243-7f7cd44ab21b?auto=format&fit=crop&q=80&w=600&h=450",
    eyebrow: "EXPANSION",
    title: "Gandhi Brothers Founded",
    body: "Gandhi Brothers was established as a partnership firm at Gomti Bhavan, Azad Chowk, with FDCA Drug Manufacturing Licence GA/2079 in Form 25D. Fifty-eight formulations across proprietary preparations, classical compounds, and single-herb materia medica — manufactured under one roof, tested before each release.",
  },
  {
    year: "2025-26",
    image: "https://images.unsplash.com/photo-1605232938361-b7d6bb1d6dd8?auto=format&fit=crop&q=80&w=600&h=450",
    eyebrow: "DIGITAL",
    title: "Direct to Your Door",
    body: "Three generations of Junagadh apothecary heritage now reach families across India directly. The shop counter became a website; the careful explanation became a product page. The dravya remains the same.",
  },
];

export default function HeritagePage() {
  return (
    <div className="bg-cream min-h-screen text-ink overflow-hidden pb-16">
      {/* ── Hero Section ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-xs text-terracotta uppercase tracking-[0.2em] font-medium mb-4">
          Our Story
        </p>
        <h1 
          className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-ink"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Three generations. Seventy-five years. One family.
        </h1>
        <div className="w-[60px] h-[2px] bg-terracotta mt-6 mb-6 mx-auto" />
        <p className="text-ink-400 max-w-2xl text-lg font-serif">
          A commitment to authentic Ayurveda from the heart of Gujarat since 1950.
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
                key={entry.year} 
                className={`relative flex items-center md:justify-between w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
              >
                {/* Era Marker */}
                <div className="absolute left-[24px] md:left-1/2 top-0 mt-8 md:top-1/2 md:mt-0 -translate-y-1/2 -translate-x-1/2 w-[64px] h-[32px] bg-terracotta rounded-md flex items-center justify-center z-20 shadow-sm border border-cream/20">
                  <span className="text-white font-bold text-sm">{entry.year}</span>
                </div>

                {/* Desktop Spacer (to push the card to the correct side) */}
                <div className="hidden md:block w-[45%]" />

                {/* Timeline Card */}
                <div className={`w-[calc(100%-60px)] md:w-[45%] ml-[60px] md:ml-0 bg-white shadow-sm border border-ink-100 rounded-xl overflow-hidden will-change-transform`}>
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
                  <div className="p-6">
                    <p className="text-xs text-terracotta uppercase tracking-[0.2em] font-medium mb-1">
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

      {/* ── Closing Section ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <p className="text-xs text-terracotta uppercase tracking-[0.2em] font-medium mb-4">
          The Next Chapter
        </p>
        <h2 
          className="text-3xl md:text-4xl text-ink font-semibold"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Carrying it forward.
        </h2>
        <div className="w-[60px] h-[2px] bg-terracotta mt-6 mb-8 mx-auto" />
        <p className="max-w-2xl mx-auto text-ink-400 leading-relaxed md:text-lg mb-10">
          Every batch we manufacture today carries the same intent that started in that small Junagadh shop in 1950 — authentic ingredients, careful preparation, and the trust of the people we serve. We believe Ayurveda deserves to be made the right way.
        </p>
        <Button 
          asChild
          size="lg" 
          className="bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-8 py-6 text-base font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <Link href="/products">
            Browse our formulations
          </Link>
        </Button>
      </section>
    </div>
  );
}
