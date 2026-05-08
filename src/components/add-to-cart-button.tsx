"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddToCartButton({
  product,
  className,
  size = "default",
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const effectivePrice = product.discount_price ?? product.price;
  const isOutOfStock = product.stock === 0;

  function handleAdd() {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: effectivePrice,
      quantity: 1,
      image: product.image,
      stock: product.stock,
    });

    toast.success(`${product.name} added to cart`, {
      description: `₹${effectivePrice}`,
      duration: 2500,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (isOutOfStock) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={className}
        aria-label="Out of stock"
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      size={size}
      onClick={handleAdd}
      className={className}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
