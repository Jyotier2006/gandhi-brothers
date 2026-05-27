"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart-store";
import type { CartItem } from "@/lib/types";

/**
 * Re-adds a past order's still-available items to the cart, then opens the cart.
 * Items are pre-resolved server-side to current price/stock (see /account),
 * and `unavailable` counts items that are sold out or no longer in the catalogue.
 * The shopper is already signed in here, so no auth gate is needed.
 */
export function BuyAgainButton({
  items,
  unavailable,
}: {
  items: CartItem[];
  unavailable: number;
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <span className="text-xs italic text-ink/40">No items available to reorder</span>
    );
  }

  function handleClick() {
    items.forEach((it) => addItem(it));
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    toast.success(
      `Added ${count} item${count === 1 ? "" : "s"} to your cart` +
        (unavailable > 0 ? ` · ${unavailable} no longer available` : "")
    );
    router.push("/cart");
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-terracotta/30 bg-white px-4 py-2 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-white"
    >
      <RotateCcw className="h-4 w-4" />
      Buy again
    </button>
  );
}
