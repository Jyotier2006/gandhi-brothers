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
      <section className="relative overflow-hidden bg-[#F9F7F3]">
        {/* Decorative taupe accent — right-side vertical stripe on desktop */}
        <div className="absolute right-0 top-0 bottom-0 w-[5%] bg-terracotta/10 hidden lg:block pointer-events-none" />
        {/* Soft radial glow behind image */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-mustard/10 blur-3xl pointer-events-none hidden md:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24
                        grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Left: Copy */}
          <div className="space-y-6 text-center md:text-left">
            <p className="text-xs sm:text-sm text-terracotta font-bold uppercase tracking-[0.18em]">
              Junagadh, since 1950
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-ink">
              Authentic Ayurveda,<br />
              <span className="text-terracotta">made the right way.</span>
            </h1>
            {/* Brand rule */}
            <div className="h-0.5 w-10 bg-terracotta mx-auto md:mx-0" />
            <p className="text-base sm:text-lg text-ink/60 leading-relaxed max-w-lg mx-auto md:mx-0">
              FDCA-licensed classical and proprietary formulations, manufactured
              by a family that has dispensed Ayurvedic medicine in Saurashtra
              for three generations.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/products">
                <Button size="lg">
                  Shop the catalogue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#heritage">
                <Button size="lg" variant="outline">Read our story</Button>
              </Link>
            </div>
          </div>

          {/* Right: Hero image */}
          <div className="relative w-full max-w-sm sm:max-w-md mx-auto md:max-w-none
                          aspect-square rounded-3xl overflow-hidden
                          bg-gradient-to-br from-cream to-white
                          border border-ink/5 shadow-xl shadow-ink/5">
            <Image
              src="/hero.svg"
              alt="Gandhi Brothers — apothecary jars and bottles"
              fill
              priority
              unoptimized
              className="object-contain p-4"
            />
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
          <h2 className="text-3xl md:text-4xl font-semibold text-ink">Featured formulations</h2>
          <div className="h-0.5 w-10 bg-terracotta mx-auto my-4" />
          <p className="text-ink/50 max-w-xl mx-auto text-sm sm:text-base">
            Our most-trusted classical and proprietary preparations, made in small,
            documented batches.
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
            <h2 className="text-3xl md:text-4xl font-semibold text-ink">Shop by category</h2>
            <div className="h-0.5 w-10 bg-terracotta mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Churnas',  cat: 'Churna',  desc: 'Powders',                img: '/categories/churna.svg' },
              { name: 'Capsules', cat: 'Capsule', desc: 'Standardised extracts',  img: '/categories/capsule.svg' },
              { name: 'Arishtas', cat: 'Arishta', desc: 'Fermented preparations', img: '/categories/arishta.svg' },
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
              <p className="text-mustard text-xs font-bold uppercase tracking-[0.18em] mb-3">Free shipping</p>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Free delivery on orders above ₹999
              </h3>
              <p className="text-cream/80 leading-relaxed text-sm sm:text-base">
                Authentic, FDCA-compliant Ayurvedic formulations delivered across India.
                Use it as it was meant to be used — under physician guidance.
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
            <h2 className="text-3xl md:text-4xl font-semibold text-ink">In their own words</h2>
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
