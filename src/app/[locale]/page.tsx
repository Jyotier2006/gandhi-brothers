import Image from 'next/image';
import { ArrowRight, ShieldCheck, Leaf, Award } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getFeaturedProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Reveal } from '@/components/reveal';

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const featured = (await getFeaturedProducts(4)) ?? [];

  const trust = [
    { icon: ShieldCheck, title: t('trustFdcaTitle'), sub: t('trustFdcaSub') },
    { icon: Leaf, title: t('trustSourcedTitle'), sub: t('trustSourcedSub') },
    { icon: Award, title: t('trustFamilyTitle'), sub: t('trustFamilySub') },
  ];

  const categories = [
    { cat: 'Churna', name: t('churnas'), desc: t('churnasDesc'), img: '/categories/churna.svg' },
    { cat: 'Taila', name: t('tailas'), desc: t('tailasDesc'), img: '/categories/taila.svg' },
  ];

  const testimonials = [
    { quote: t('t1Quote'), name: t('t1Name'), role: t('t1Role') },
    { quote: t('t2Quote'), name: t('t2Name'), role: t('t2Role') },
    { quote: t('t3Quote'), name: t('t3Name'), role: t('t3Role') },
  ];

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F9F7F3] to-white pb-20 pt-28 md:pt-36 md:pb-28">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full bg-terracotta/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-mustard/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-terracotta/15 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            <p className="text-xs sm:text-sm text-terracotta font-bold uppercase tracking-[0.18em]">
              {t('badge')}
            </p>
          </div>

          <h1 className="animate-fade-up text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.1] text-ink tracking-tight mb-6" style={{ animationDelay: '80ms' }}>
            {t('heroTitle1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-terracotta-600">
              {t('heroTitle2')}
            </span>
          </h1>

          <div className="animate-fade-up flex items-center gap-4 w-full max-w-sm mx-auto mb-8 opacity-60" style={{ animationDelay: '160ms' }}>
            <div className="h-px bg-ink flex-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-mustard" />
            <div className="h-px bg-ink flex-1" />
          </div>

          <p className="animate-fade-up text-lg sm:text-xl text-ink/70 leading-relaxed max-w-2xl mx-auto mb-10 font-serif italic" style={{ animationDelay: '220ms' }}>
            {t('heroSubtitle')}
          </p>

          <div className="animate-fade-up flex flex-wrap gap-4 justify-center" style={{ animationDelay: '300ms' }}>
            <Link href="/products">
              <Button size="lg" className="sheen rounded-full h-12 px-8 text-base shadow-lg shadow-terracotta/20 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0">
                {t('shopCatalogue')} <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#heritage">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-terracotta/20 hover:bg-white text-ink transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0">
                {t('readStory')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-ink/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x sm:divide-ink/10">
          {trust.map(({ icon: Icon, title, sub }, i) => (
            <Reveal key={title} delay={i * 90} className="flex items-center gap-3 sm:px-6 group">
              <Icon className="h-8 w-8 text-terracotta shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-sm text-ink/50">{sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-ink">{t('staplesTitle')}</h2>
          <div className="h-0.5 w-10 bg-terracotta mx-auto my-4" />
          <p className="text-ink/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {t('staplesSubtitle')}
          </p>
        </Reveal>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full [&>*]:h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-ink/40 py-8">{t('catalogueLoading')}</p>
        )}
        <Reveal className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" size="lg" className="transition-transform duration-300 hover:-translate-y-0.5">
              {t('viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-ink">{t('apothecaryTitle')}</h2>
            <div className="h-0.5 w-10 bg-terracotta mx-auto mt-4" />
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.cat} delay={i * 90}>
                <Link
                  href={`/products?category=${c.cat}`}
                  className="group block rounded-2xl bg-cream hover:bg-terracotta/5 border border-ink/8 hover:border-terracotta/20 transition-all duration-300 overflow-hidden hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-cream to-white">
                    <Image
                      src={c.img} alt={c.name} fill unoptimized
                      className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-ink group-hover:text-terracotta transition-colors">{c.name}</h3>
                    <p className="text-sm text-ink/50 mt-0.5">{c.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFER BANNER ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="relative overflow-hidden rounded-3xl bg-terracotta text-white px-8 py-10 md:px-12 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl shadow-terracotta/20">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-mustard/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-mustard text-xs font-bold uppercase tracking-[0.18em] mb-3">{t('offerEyebrow')}</p>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-cream">
                {t('offerTitle')}
              </h3>
              <p className="text-cream/80 leading-relaxed text-sm sm:text-base">
                {t('offerBody')}
              </p>
            </div>
            <div className="relative flex md:justify-end">
              <Link href="/products">
                <Button variant="accent" size="lg" className="sheen transition-transform duration-300 hover:-translate-y-0.5">{t('startShopping')}</Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white" id="heritage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-ink">{t('testimonialsTitle')}</h2>
            <div className="h-0.5 w-10 bg-terracotta mx-auto mt-4" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tst, i) => (
              <Reveal key={i} delay={i * 90} className="h-full">
                <div className="h-full p-6 rounded-2xl bg-[#F9F7F3] border border-ink/8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-terracotta/15">
                  <p className="text-ink/80 leading-relaxed italic text-sm sm:text-base">
                    &ldquo;{tst.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-terracotta/15 flex items-center justify-center shrink-0">
                      <span className="text-terracotta font-bold text-xs">{tst.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-ink">{tst.name}</p>
                      <p className="text-xs text-ink/40">{tst.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
