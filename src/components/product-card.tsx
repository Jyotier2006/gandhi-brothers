'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart-store';
import { WishlistButton } from '@/components/wishlist-button';
import { toast } from 'sonner';
import { calculateDiscount, effectivePrice, formatINR } from '@/lib/utils';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE = '/products/_fallback.svg';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE);
  const [isHovered, setIsHovered] = useState(false);

  const discountPct = calculateDiscount(product.price, product.discount_price);
  const finalPrice = effectivePrice(product.price, product.discount_price);
  const inStock = product.stock > 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!inStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: 1,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col h-full rounded-sm bg-white border border-ink-50 shadow-sm hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full rounded-t-sm bg-gradient-to-br from-cream to-[#F7EFE8] overflow-hidden p-6 border-b border-ink-50/50">
        
        {/* Soft Background glow behind image */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/60 blur-3xl rounded-full transition-opacity duration-700",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        <div className="relative w-full h-full transform transition-transform duration-[1.5s] group-hover:scale-110 ease-out">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain drop-shadow-xl"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            unoptimized={imgSrc.endsWith('.svg')}
          />
        </div>

        {discountPct > 0 && inStock && (
          <Badge variant="warning" className="absolute top-4 left-4 bg-white/90 text-mustard border-none shadow-sm font-bold backdrop-blur">
            {discountPct}% OFF
          </Badge>
        )}

        {/* Wishlist toggle */}
        <div className="absolute top-3 right-3 z-20">
          <WishlistButton
            item={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: finalPrice,
              image: product.image,
              category: product.category,
            }}
          />
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-colors">
            <Badge variant="destructive" className="font-bold text-sm shadow-xl shadow-red-900/20 px-4 py-1.5 rounded-full border border-white/20">
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow relative bg-white z-10">
        <p className="text-[11px] font-bold text-terracotta/80 uppercase tracking-widest mb-2 font-sans">
          {product.category}
        </p>
        <h3 className="font-bold text-lg text-ink line-clamp-2 leading-tight mb-2 group-hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-[1.35rem] text-ink leading-none">{formatINR(finalPrice)}</span>
            {product.discount_price && product.discount_price < product.price && (
              <span className="text-xs text-ink-300 font-semibold line-through mt-0.5">
                {formatINR(product.price)}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAdd}
            disabled={!inStock}
            size="icon"
            className={cn(
              "h-12 w-12 rounded-2xl shadow-lg transition-all duration-300 border border-transparent shrink-0 ml-2",
              inStock 
                ? "bg-ink hover:bg-terracotta shadow-ink/20 hover:shadow-terracotta/30 text-white" 
                : "bg-ink-100 text-ink-300 cursor-not-allowed shadow-none"
            )}
            aria-label={inStock ? "Add to cart" : "Sold out"}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
