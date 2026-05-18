'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, X, Package, ArrowRight } from 'lucide-react';
import type { Product, ProductGroup } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';
import { calculateDiscount, effectivePrice, formatINR, cn } from '@/lib/utils';

const FALLBACK_IMAGE = '/products/_fallback.svg';

export function ProductGroupCard({ group }: { group: ProductGroup }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(group.image || FALLBACK_IMAGE);
  const [isHovered, setIsHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Close modal on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }

  // Price range display
  const prices = group.variants.map((v) => effectivePrice(v.price, v.discount_price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasDiscount = group.variants.some(
    (v) => v.discount_price !== null && v.discount_price < v.price
  );
  const anyInStock = group.variants.some((v) => v.stock > 0);

  return (
    <>
      {/* ── Card ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="group flex flex-col h-full rounded-sm bg-white border border-ink-50 shadow-sm hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 overflow-hidden text-left w-full"
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
          {hasDiscount && anyInStock && (
            <Badge
              variant="warning"
              className="absolute top-4 left-4 bg-white/90 text-mustard border-none shadow-sm font-bold backdrop-blur"
            >
              Offer
            </Badge>
          )}
          {!anyInStock && (
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Badge
                variant="destructive"
                className="font-bold text-sm shadow-xl px-4 py-1.5 rounded-full border border-white/20"
              >
                Sold Out
              </Badge>
            </div>
          )}
          {/* Pack count indicator */}
          {group.variants.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-bold text-ink/70 shadow-sm border border-ink/5">
              {group.variants.length} sizes
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
            </div>
            <div className="h-10 w-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink/40 group-hover:bg-terracotta/10 group-hover:text-terracotta transition-all">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </button>

      {/* ── Modal Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-ink/60" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-cream to-[#F7EFE8] p-6 pb-4 text-center border-b border-ink/5">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <Image
                  src={imgSrc}
                  alt={group.baseName}
                  fill
                  className="object-contain drop-shadow-lg"
                  unoptimized={imgSrc.endsWith('.svg')}
                />
              </div>
              <p className="text-[10px] font-bold text-terracotta uppercase tracking-widest mb-1">
                {group.category}
              </p>
              <h2 className="text-xl font-bold text-ink">{group.baseName}</h2>
            </div>

            {/* Variants List */}
            <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
              <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest px-1 mb-3">
                Choose pack size
              </p>
              {group.variants.map((variant) => (
                <VariantRow
                  key={variant.id}
                  variant={variant}
                  onClose={() => setIsOpen(false)}
                />
              ))}

              {/* Bulk Order */}
              <Link
                href="/inquiry"
                className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-terracotta/5 to-mustard/5 border border-terracotta/10 hover:border-terracotta/30 transition-all duration-200 group/bulk mt-3"
                onClick={() => setIsOpen(false)}
              >
                <div className="h-10 w-10 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0 group-hover/bulk:bg-terracotta/20 transition-colors">
                  <Package className="h-5 w-5 text-terracotta" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">Bulk Order (5 kg+)</p>
                  <p className="text-xs text-ink/50">Get wholesale pricing</p>
                </div>
                <ArrowRight className="h-4 w-4 text-terracotta/50 group-hover/bulk:text-terracotta transition-colors" />
              </Link>
            </div>

            {/* Footer link */}
            <div className="p-4 pt-0 border-t border-ink/5 mt-2">
              <Link
                href={`/products/${group.slug}`}
                className="block text-center text-sm font-semibold text-terracotta hover:text-terracotta-800 py-3 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View full details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** A single variant row inside the modal */
function VariantRow({
  variant,
  onClose,
}: {
  variant: Product;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const finalPrice = effectivePrice(variant.price, variant.discount_price);
  const discount = calculateDiscount(variant.price, variant.discount_price);
  const inStock = variant.stock > 0;

  function handleAdd() {
    if (!inStock) return;
    addItem({
      productId: variant.id,
      slug: variant.slug,
      name: variant.name,
      price: finalPrice,
      image: variant.image,
      quantity: 1,
      stock: variant.stock,
    });
    toast.success(`${variant.name} added to cart`);
    onClose();
  }

  // Extract the actual pack size label from the name
  const packLabel = variant.pack_size || variant.name.match(/\(([^)]+)\)/)?.[1] || 'Standard';

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200',
        inStock
          ? 'border-ink/5 bg-ink/[0.02] hover:border-terracotta/20 hover:bg-terracotta/[0.02]'
          : 'border-ink/5 bg-ink/[0.02] opacity-50'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-ink">{packLabel}</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-bold text-base text-ink">{formatINR(finalPrice)}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-ink/30 line-through">{formatINR(variant.price)}</span>
              <span className="text-xs font-bold text-mustard">{discount}% off</span>
            </>
          )}
        </div>
      </div>
      <Button
        onClick={handleAdd}
        disabled={!inStock}
        size="sm"
        className={cn(
          'rounded-xl h-9 px-4 text-xs font-bold shrink-0 transition-all',
          inStock
            ? 'bg-ink hover:bg-terracotta text-white shadow-sm'
            : 'bg-ink/10 text-ink/30 cursor-not-allowed'
        )}
      >
        {inStock ? (
          <>
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" /> Add
          </>
        ) : (
          'Sold out'
        )}
      </Button>
    </div>
  );
}
