import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";
import { getProductBySlug, getProductGroupBySlug, getRelatedProducts } from "@/lib/products";
import { getProductDescription } from "@/lib/product-descriptions";
import { getReviewsForProduct, summarise, toReviewKey } from "@/lib/reviews";
import { calculateDiscount, effectivePrice, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { StarRating } from "@/components/reviews/star-rating";
import ProductRichContent from "@/components/ProductRichContent";
import { SITE_URL } from "@/lib/site-url";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const price = effectivePrice(product.price, product.discount_price);
  const description =
    product.description ||
    `${product.name} — an authentic, FDCA-licensed Ayurvedic preparation by Gandhi Brothers, Junagadh. ${formatINR(price)}, delivered across India.`;
  const url = `${SITE_URL}/products/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      url,
      title: `${product.name} | Gandhi Brothers`,
      description,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Gandhi Brothers`,
      description,
      images: [product.image],
    },
  };
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProductGroupBySlug(slug);

  if (!result) {
    notFound();
  }

  const { group, current: product } = result;

  const richContent = getProductDescription(
    product.sku ?? product.slug ?? product.name
  );

  const discount = calculateDiscount(product.price, product.discount_price);

  const relatedProducts = await getRelatedProducts(product, 4);

  // ── Reviews (Sheets-backed; empty until real, approved reviews exist) ────
  const reviewKey = toReviewKey(product.slug);
  const reviews = await getReviewsForProduct(reviewKey);
  const reviewSummary = summarise(reviews);

  // ── Structured data ────────────────────────────────────────────────────
  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: group.baseName,
    image: `${SITE_URL}${product.image}`,
    description:
      product.description ||
      `${group.baseName} — authentic FDCA-licensed Ayurvedic preparation by Gandhi Brothers, Junagadh.`,
    category: product.category,
    brand: { "@type": "Brand", name: "Gandhi Brothers" },
    offers: group.variants.map((v) => ({
      "@type": "Offer",
      url: `${SITE_URL}/products/${v.slug}`,
      priceCurrency: "INR",
      price: effectivePrice(v.price, v.discount_price),
      availability:
        v.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    })),
  };

  // Only emit rating/review markup when real reviews exist — never fabricate it.
  if (reviewSummary.count > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewSummary.average,
      reviewCount: reviewSummary.count,
      bestRating: 5,
      worstRating: 1,
    };
    productJsonLd.review = reviews.slice(0, 8).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      ...(r.title ? { name: r.title } : {}),
      reviewBody: r.body,
    }));
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${SITE_URL}/products?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: group.baseName,
        item: `${SITE_URL}/products/${product.slug}`,
      },
    ],
  };

  return (
    <article className="relative min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-cream to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            {
              label: product.category,
              href: `/products?category=${encodeURIComponent(product.category)}`,
            },
            { label: group.baseName },
          ]}
        />

        {/* ── Top Layout Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Image Area */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-terracotta/20 to-mustard/20 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

            <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-sm border border-white shadow-2xl p-8 flex items-center justify-center">
              <div className="relative w-full h-full transform transition-transform duration-[2s] group-hover:scale-105">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-contain drop-shadow-2xl ${product.image.endsWith('.svg') ? 'animate-[float_6s_ease-in-out_infinite]' : ''}`}
                  unoptimized={product.image.endsWith('.svg')}
                />
              </div>

              {discount > 0 && (
                <Badge variant="warning" className="absolute left-6 top-6 shadow-xl bg-white/90 text-mustard border-white backdrop-blur font-bold text-sm px-4 py-1.5 rounded-full">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Right Column: Info Stack */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-bold tracking-widest uppercase">
                <Sparkles className="h-3 w-3" />
                <span>{product.category}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-ink leading-[1.1] tracking-tight">
                {group.baseName}
              </h1>

              {reviewSummary.count > 0 && (
                <a href="#reviews" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors">
                  <StarRating value={reviewSummary.average} size={16} />
                  <span className="font-semibold">{reviewSummary.average.toFixed(1)}</span>
                  <span className="text-ink/40">
                    ({reviewSummary.count} {reviewSummary.count === 1 ? "review" : "reviews"})
                  </span>
                </a>
              )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-ink-100 to-transparent" />

            {/* Purchase panel: pack-size selector, price, quantity, actions, wishlist */}
            <ProductPurchasePanel variants={group.variants} currentSlug={product.slug} />

            <div className="h-px w-full bg-gradient-to-r from-ink-100 to-transparent" />

            {/* Description */}
            {richContent ? (
              <ProductRichContent product={richContent} />
            ) : (
              <p className="text-ink/80 font-serif leading-relaxed text-lg max-w-xl">
                {product.description}
              </p>
            )}

            {/* FDCA Manufacturing Notice Box */}
            <div className="mt-8 bg-gradient-to-r from-cream to-[#f2eee9] border border-white rounded-[2rem] p-6 shadow-inner flex items-start gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                <ShieldCheck className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <span className="font-bold font-sans text-ink block mb-1">
                  FDCA Licensed Manufacturing
                </span>
                <span className="font-serif text-ink/70 block leading-snug">
                  Gandhi Brothers, Junagadh — Licence GA/2079, Form 25D.
                </span>
                <span className="font-serif text-mustard-600/[0.85] font-semibold text-[13px] block mt-2">
                  * Ayurvedic medicine. Use under proper medical supervision.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Customer Reviews ────────────────────────────────────────────────── */}
        <ReviewsSection
          productKey={reviewKey}
          productName={group.baseName}
          reviews={reviews}
          summary={reviewSummary}
        />

        {/* ── Related Items ───────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 pt-16 border-t border-ink-100/50">
            <h2 className="text-3xl font-bold font-sans text-ink mb-6 text-center lg:text-left">
              You might also like
            </h2>
            <div className="h-1 w-16 bg-mustard rounded-full mb-10 mx-auto lg:mx-0" />

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((p) => (
                <div key={p.id} className="transition-all duration-500 hover:-translate-y-2">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
}
