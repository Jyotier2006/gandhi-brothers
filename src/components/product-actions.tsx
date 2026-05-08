"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { effectivePrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const isOutOfStock = product.stock === 0;
  const currentPrice = effectivePrice(product.price, product.discount_price);

  const decreaseQty = () => {
    if (qty > 1) setQty((q) => q - 1);
  };

  const increaseQty = () => {
    if (qty < product.stock) setQty((q) => q + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      image: product.image,
      quantity: qty,
      stock: product.stock,
    });

    toast.success(`${product.name} (×${qty}) added to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  if (isOutOfStock) {
    return (
      <Button disabled size="lg" className="w-full">
        Sold out — notify me
      </Button>
    );
  }

  return (
    <div className="space-y-5">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-ink uppercase tracking-wider">
          Quantity
        </span>
        <div className="flex items-center rounded-lg border border-ink-100 bg-white shadow-sm overflow-hidden h-10">
          <button
            type="button"
            className="flex h-full w-10 items-center justify-center text-ink hover:bg-cream disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            onClick={decreaseQty}
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
            onClick={increaseQty}
            disabled={qty >= product.stock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Two-column Button Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleAddToCart}
          className="w-full text-base"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={handleBuyNow}
          className="w-full text-base"
        >
          <Zap className="h-4 w-4" />
          Buy now
        </Button>
      </div>
    </div>
  );
}
