"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap, Check } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { calculateDiscount, effectivePrice, formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

interface ProductPurchasePanelProps {
  variants: Product[];
  currentSlug: string;
}

/** Pack-size label for a variant, e.g. "200g". Falls back to the parenthetical in the name. */
function packLabel(v: Product): string {
  return v.pack_size || v.name.match(/\(([^)]+)\)/)?.[1] || "Standard";
}

export function ProductPurchasePanel({ variants, currentSlug }: ProductPurchasePanelProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const current = variants.find((v) => v.slug === currentSlug) ?? variants[0];
  const price = effectivePrice(current.price, current.discount_price);
  const discount = calculateDiscount(current.price, current.discount_price);
  const inStock = current.stock > 0;
  const lowStock = inStock && current.stock <= 5;

  const wishlistItem = {
    productId: current.id,
    slug: current.slug,
    name: current.name,
    price,
    image: current.image,
    category: current.category,
  };

  function addToCart() {
    if (!inStock) return;
    addItem({
      productId: current.id,
      slug: current.slug,
      name: current.name,
      price,
      image: current.image,
      quantity: qty,
      stock: current.stock,
    });
    toast.success(`${current.name} (×${qty}) added to cart`);
  }

  function buyNow() {
    if (!inStock) return;
    addToCart();
    router.push("/checkout");
  }

  return (
    <div className="space-y-6">
      {/* ── Pricing ── */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-4xl font-extrabold text-ink tracking-tight">
          {formatINR(price)}
        </span>
        {discount > 0 && (
          <>
            <span className="text-xl font-bold text-ink-300 line-through">
              {formatINR(current.price)}
            </span>
            <span className="text-sm font-bold text-mustard">{discount}% off</span>
          </>
        )}
        <span className="text-sm font-semibold text-ink/40 ml-1 uppercase tracking-wide">
          incl. of all taxes
        </span>
      </div>

      {/* ── Stock status ── */}
      <div>
        {!inStock ? (
          <Badge variant="destructive" className="px-4 py-1.5 rounded-xl font-bold border border-red-900/10 shadow-sm">
            Out of stock
          </Badge>
        ) : lowStock ? (
          <Badge variant="warning" className="px-4 py-1.5 rounded-xl font-bold bg-mustard/10 text-mustard-700 border border-mustard/30">
            Only {current.stock} left
          </Badge>
        ) : (
          <Badge variant="success" className="px-4 py-1.5 rounded-xl font-bold bg-green-50 text-green-700 border border-green-200">
            In stock
          </Badge>
        )}
      </div>

      {/* ── Pack size selector ── */}
      {variants.length > 1 && (
        <div className="space-y-3">
          <span className="text-sm font-semibold text-ink uppercase tracking-wider">
            Pack size
          </span>
          <div className="flex flex-wrap gap-3">
            {variants.map((v) => {
              const selected = v.slug === current.slug;
              const vPrice = effectivePrice(v.price, v.discount_price);
              const vOut = v.stock === 0;
              return (
                <Link
                  key={v.id}
                  href={`/products/${v.slug}`}
                  scroll={false}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative flex flex-col items-start rounded-2xl border px-4 py-3 min-w-[7rem] transition-all duration-200",
                    selected
                      ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-sm"
                      : "border-ink-100 bg-white hover:border-terracotta/40 hover:bg-cream/40",
                    vOut && "opacity-60"
                  )}
                >
                  {selected && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white shadow">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className="font-bold text-sm text-ink">{packLabel(v)}</span>
                  <span className="text-xs text-ink/60 mt-0.5">
                    {formatINR(vPrice)}
                    {vOut && " · sold out"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Quantity + actions ── */}
      {inStock ? (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-ink uppercase tracking-wider">Quantity</span>
            <div className="flex items-center rounded-lg border border-ink-100 bg-white shadow-sm overflow-hidden h-10">
              <button
                type="button"
                className="flex h-full w-10 items-center justify-center text-ink hover:bg-cream disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="px-4 min-w-[3rem] text-center font-semibold text-sm border-x border-ink-100/50">
                {qty}
              </div>
              <button
                type="button"
                className="flex h-full w-10 items-center justify-center text-ink hover:bg-cream disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                onClick={() => setQty((q) => Math.min(current.stock, q + 1))}
                disabled={qty >= current.stock}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={addToCart} className="w-full text-base">
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
            <Button variant="default" size="lg" onClick={buyNow} className="w-full text-base">
              <Zap className="h-4 w-4" />
              Buy now
            </Button>
          </div>

          <WishlistButton item={wishlistItem} display="full" className="w-full sm:w-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          <Button disabled size="lg" className="w-full">
            Sold out
          </Button>
          <WishlistButton item={wishlistItem} display="full" className="w-full sm:w-auto" />
          {variants.length > 1 && (
            <p className="text-sm text-ink/50">
              Try a different pack size above, or{" "}
              <Link href="/inquiry" className="text-terracotta font-semibold hover:underline">
                ask us about availability
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
}
