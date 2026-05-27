'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Award } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { ProductGroup } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { WishlistButton } from '@/components/wishlist-button';
import { effectivePrice, formatINR, cn } from '@/lib/utils';

const FALLBACK_IMAGE = '/products/_fallback.svg';

/**
 * Shop-listing card for a grouped product (one entry per base product name).
 * Clicking anywhere opens the full product page, where the pack-size selector
 * lives. No modal — the detail page is the "big screen" experience.
 */
export function ProductGroupCard({ group }: { group: ProductGroup }) {
  const t = useTranslations('common');
  const [imgSrc, setImgSrc] = useState(group.image || FALLBACK_IMAGE);
  const [isHovered, setIsHovered] = useState(false);

  const prices = group.variants.map((v) => effectivePrice(v.price, v.discount_price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasDiscount = group.variants.some(
    (v) => v.discount_price !== null && v.discount_price < v.price
  );
  const anyInStock = group.variants.some((v) => v.stock > 0);

  return (
    <Link
      href={`/products/${group.slug}`}
      aria-label={t('viewProduct', { name: group.baseName })}
      className="group flex flex-col h-full rounded-sm bg-white border border-ink-50 shadow-sm hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 overflow-hidden hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full rounded-t-sm bg-gradient-to-br from-cream to-[#F7EFE8] overflow-hidden p-6 border-b border-ink-50/50">
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/60 blur-3xl rounded-full transition-opacity duration-700',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div className="relative w-full h-full transform transition-transform duration-[1.5s] group-hover:scale-110 ease-out">
          <Image
            src={imgSrc}
            alt={group.baseName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain drop-shadow-xl"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            unoptimized={imgSrc.endsWith('.svg')}
          />
        </div>

        {/* Top-left badge stack: Bestseller (real-sales driven) above any Offer */}
        {(group.bestseller || (hasDiscount && anyInStock)) && (
          <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-1.5">
            {group.bestseller && (
              <Badge className="flex items-center gap-1 border-none bg-gradient-to-r from-mustard to-terracotta px-2.5 font-bold text-white shadow-sm backdrop-blur">
                <Award className="h-3 w-3" />
                {t('bestseller')}
              </Badge>
            )}
            {hasDiscount && anyInStock && (
              <Badge
                variant="warning"
                className="border-none bg-white/90 font-bold text-mustard shadow-sm backdrop-blur"
              >
                {t('offer')}
              </Badge>
            )}
          </div>
        )}

        {/* Wishlist toggle (stops propagation so it doesn't navigate) */}
        <div className="absolute top-3 right-3 z-20">
          <WishlistButton
            item={{
              productId: group.variants[0].id,
              slug: group.slug,
              name: group.baseName,
              price: minPrice,
              image: group.image,
              category: group.category,
            }}
          />
        </div>

        {!anyInStock && (
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Badge
              variant="destructive"
              className="font-bold text-sm shadow-xl px-4 py-1.5 rounded-full border border-white/20"
            >
              {t('soldOut')}
            </Badge>
          </div>
        )}

        {/* Pack count indicator */}
        {group.variants.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-bold text-ink/70 shadow-sm border border-ink/5">
            {t('sizes', { count: group.variants.length })}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow relative bg-white z-10">
        <p className="text-[11px] font-bold text-terracotta/80 uppercase tracking-widest mb-2 font-sans">
          {group.category}
        </p>
        <h3 className="font-bold text-lg text-ink line-clamp-2 leading-tight mb-3 group-hover:text-terracotta transition-colors">
          {group.baseName}
        </h3>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            {minPrice === maxPrice ? (
              <span className="font-bold text-[1.2rem] text-ink leading-none">
                {formatINR(minPrice)}
              </span>
            ) : (
              <span className="font-bold text-[1.1rem] text-ink leading-none">
                {formatINR(minPrice)} – {formatINR(maxPrice)}
              </span>
            )}
            {group.variants.length > 1 && (
              <span className="text-[11px] text-ink/40 mt-1 font-medium">
                {t('packSizes', { count: group.variants.length })}
              </span>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink/40 group-hover:bg-terracotta group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
