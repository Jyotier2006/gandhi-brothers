import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Leaf, Award } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';

export const revalidate = 60;

export default async function HomePage() {
  const featured = (await getFeaturedProducts(4)) ?? [];

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F9F7F3] to-white pb-16 pt-24 md:pt-32 md:pb-24">
        {/* Soft radial glows for depth */}
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full bg-terracotta/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-mustard/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-terracotta/15 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            <p className="text-xs sm:text-sm text-terracotta font-bold uppercase tracking-[0.18em]">
              Junagadh, since 1950
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.1] text-ink tracking-tight mb-6">
            Rooted in tradition.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-terracotta-600">
              Crafted for today.
            </span>
          </h1>

          <div className="flex items-center gap-4 w-full max-w-sm mx-auto mb-8 opacity-60">
            <div className="h-px bg-ink flex-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-mustard" />
            <div className="h-px bg-ink flex-1" />
          </div>

          <p className="text-lg sm:text-xl text-ink/70 leading-relaxed max-w-2xl mx-auto mb-10 font-serif italic">
            For three generations, our family has stood behind the counter in Junagadh, sharing the healing wisdom of Ayurveda. Today, we bring those same authentic, time-tested formulations directly to you—carefully crafted, FDCA-certified, and made the right way.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-lg shadow-terracotta/20">
                Shop the catalogue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#heritage">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-terracotta/20 hover:bg-white text-ink">
                Read our story
              </Button>
            </Link>
          </div>
          
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-ink/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8
                        grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x sm:divide-ink/10">
          {[
            { icon: ShieldCheck, title: 'FDCA Licensed', sub: 'GA/2079 — Form 25D' },
            { icon: Leaf,        title: 'Sourced at origin', sub: 'Authentic materia medica' },
            { icon: Award,       title: 'Family-run since 1950', sub: 'A Junagadh legacy' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 sm:px-6">
              <Icon className="h-8 w-8 text-terracotta shrink-0" />
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-sm text-ink/50">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-ink">Discover our staples</h2>
          <div className="h-0.5 w-10 bg-terracotta mx-auto my-4" />
          <p className="text-ink/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            These are the preparations our community has trusted for decades. Made in small, careful batches to ensure every pouch and bottle meets the standards our grandfather set.
          </p>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-ink/40 py-8">
            Catalogue loading — please check back shortly.
          </p>
        )}
        <div className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" size="lg">
              View all products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-ink">Explore our apothecary</h2>
            <div className="h-0.5 w-10 bg-terracotta mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Churnas',  cat: 'Churna',  desc: 'Powders',                img: '/categories/churna.svg' },
              { name: 'Tailas',   cat: 'Taila',   desc: 'Medicated oils',          img: '/categories/taila.svg' },
            ].map((c) => (
              <Link
                key={c.cat}
                href={`/products?category=${c.cat}`}
                className="group rounded-2xl bg-cream hover:bg-terracotta/5
                           border border-ink/8 hover:border-terracotta/20
                           transition-all duration-300 overflow-hidden hover:shadow-md"
              >
                <div className="relative aspect-square bg-gradient-to-br from-cream to-white">
                  <Image
                    src={c.img} alt={c.name} fill unoptimized
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-ink group-hover:text-terracotta transition-colors">{c.name}</h3>
                  <p className="text-sm text-ink/50 mt-0.5">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFER BANNER ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-terracotta text-white
                          px-8 py-10 md:px-12 md:py-14
                          grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-mustard text-xs font-bold uppercase tracking-[0.18em] mb-3">From our family to yours</p>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-cream">
                Experience true Ayurveda
              </h3>
              <p className="text-cream/80 leading-relaxed text-sm sm:text-base">
                We believe that genuine wellness comes from pure ingredients and centuries of wisdom. Explore our complete catalogue of classical formulations, properly prepared and delivered straight to your home across India.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link href="/products">
                <Button variant="accent" size="lg">Start shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white" id="heritage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-ink">What our community says</h2>
            <div className="h-0.5 w-10 bg-terracotta mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'I have prescribed Gandhi Brothers Triphala for two years. The granulation, taste and consistency are exactly what classical preparation should be.',
                name: 'Dr. Mehul Joshi', role: 'BAMS, Ahmedabad',
              },
              {
                quote: 'Three generations of my family have bought medicines from JGV in Junagadh. The new manufacturing brand carries that same standard.',
                name: 'Pareshbhai Shah', role: 'Long-time customer',
              },
              {
                quote: 'Their compliance discipline is rare in this industry — proper batch numbers, traceable raw materials, FDCA paperwork in order.',
                name: 'Dr. Nilam Patel', role: 'Panchakarma centre owner',
              },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#F9F7F3] border border-ink/8">
                <p className="text-ink/80 leading-relaxed italic text-sm sm:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-terracotta/15 flex items-center justify-center shrink-0">
                    <span className="text-terracotta font-bold text-xs">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-ink">{t.name}</p>
                    <p className="text-xs text-ink/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
