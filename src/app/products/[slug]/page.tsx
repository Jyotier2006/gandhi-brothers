import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { getProductDescription } from "@/lib/product-descriptions";
import { calculateDiscount, effectivePrice, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "@/components/product-actions";
import { ProductCard } from "@/components/product-card";
import ProductRichContent from "@/components/ProductRichContent";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const richContent = getProductDescription(
    product.sku ?? product.slug ?? product.name
  );

  const currentPrice = effectivePrice(product.price, product.discount_price);
  const discount = calculateDiscount(product.price, product.discount_price);
  const isOutOfStock = product.stock === 0;

  // Retrieve related products
  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <article className="relative min-h-screen pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-cream to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16">
        
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
                {product.name}
              </h1>

              {/* Pricing Row */}
              <div className="flex flex-wrap items-baseline gap-3 pt-2">
                <span className="text-4xl font-extrabold text-ink tracking-tight">
                  {formatINR(currentPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-xl font-bold text-ink-300 line-through">
                    {formatINR(product.price)}
                  </span>
                )}
                <span className="text-sm font-semibold text-ink/40 ml-2 uppercase tracking-wide">
                  incl. of all taxes
                </span>
              </div>
            </div>

            {/* Stock Availability */}
            <div>
              {isOutOfStock ? (
                <Badge variant="destructive" className="px-4 py-1.5 rounded-xl font-bold border border-red-900/10 shadow-sm">Out of stock</Badge>
              ) : (
                <Badge variant="success" className="px-4 py-1.5 rounded-xl font-bold bg-green-50 text-green-700 border border-green-200">
                  In stock
                </Badge>
              )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-ink-100 to-transparent" />

            {/* Description */}
            {richContent ? (
              <ProductRichContent product={richContent} />
            ) : (
              <p className="text-ink/80 font-serif leading-relaxed text-lg max-w-xl">
                {product.description}
              </p>
            )}

            <div className="w-full xl:w-4/5 pt-2">
              <ProductActions product={product} />
            </div>

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

        {/* ── Related Items ───────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 pt-16 border-t border-ink-100/50">
            <h2 className="text-3xl font-bold font-sans text-ink mb-6 text-center lg:text-left">
              You might also need
            </h2>
            <div className="h-1 w-16 bg-mustard rounded-full mb-10 mx-auto lg:mx-0" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
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
