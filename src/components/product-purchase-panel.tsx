"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingCart, Zap, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCartGuard } from "@/lib/use-cart-guard";
import { calculateDiscount, effectivePrice, formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";
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
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const guardAddToCart = useCartGuard();
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

  function cartItem() {
    return {
      productId: current.id,
      slug: current.slug,
      name: current.name,
      price,
      image: current.image,
      quantity: qty,
      stock: current.stock,
    };
  }

  // Guard requires Google sign-in first; on success the action replays automatically.
  function addToCart() {
    if (!inStock) return;
    guardAddToCart(cartItem());
  }

  function buyNow() {
    if (!inStock) return;
    guardAddToCart(cartItem(), { buyNow: true });
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
            <span className="text-sm font-bold text-mustard">{tc("percentOff", { pct: discount })}</span>
          </>
        )}
        <span className="text-sm font-semibold text-ink/40 ml-1 uppercase tracking-wide">
          {t("inclTaxes")}
        </span>
      </div>

      {/* ── Stock status ── */}
      <div>
        {!inStock ? (
          <Badge variant="destructive" className="px-4 py-1.5 rounded-xl font-bold border border-red-900/10 shadow-sm">
            {tc("outOfStock")}
          </Badge>
        ) : lowStock ? (
          <Badge variant="warning" className="px-4 py-1.5 rounded-xl font-bold bg-mustard/10 text-mustard-700 border border-mustard/30">
            {tc("onlyLeft", { count: current.stock })}
          </Badge>
        ) : (
          <Badge variant="success" className="px-4 py-1.5 rounded-xl font-bold bg-green-50 text-green-700 border border-green-200">
            {tc("inStock")}
          </Badge>
        )}
      </div>

      {/* ── Pack size selector ── */}
      {variants.length > 1 && (
        <div className="space-y-3">
          <span className="text-sm font-semibold text-ink uppercase tracking-wider">
            {t("packSize")}
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
                    {vOut && ` · ${tc("soldOut")}`}
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
            <span className="text-sm font-semibold text-ink uppercase tracking-wider">{t("quantity")}</span>
            <div className="flex items-center rounded-lg border border-ink-100 bg-white shadow-sm overflow-hidden h-10">
              <button
                type="button"
                className="flex h-full w-10 items-center justify-center text-ink hover:bg-cream disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label={t("decreaseQty")}
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
                aria-label={t("increaseQty")}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={addToCart} className="w-full text-base">
              <ShoppingCart className="h-4 w-4" />
              {tc("addToCart")}
            </Button>
            <Button variant="default" size="lg" onClick={buyNow} className="w-full text-base">
              <Zap className="h-4 w-4" />
              {tc("buyNow")}
            </Button>
          </div>

          <WishlistButton item={wishlistItem} display="full" className="w-full sm:w-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          <Button disabled size="lg" className="w-full">
            {tc("soldOut")}
          </Button>
          <WishlistButton item={wishlistItem} display="full" className="w-full sm:w-auto" />
          {variants.length > 1 && (
            <p className="text-sm text-ink/50">
              {t("soldOutTryOther")}{" "}
              <Link href="/inquiry" className="text-terracotta font-semibold hover:underline">
                {t("askAvailability")}
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
}
