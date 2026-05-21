"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore, type WishlistItem } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  item: WishlistItem;
  /** "icon" = compact circular button (product cards); "full" = labelled pill (detail page). */
  display?: "icon" | "full";
  className?: string;
}

export function WishlistButton({ item, display = "icon", className }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const toggle = useWishlistStore((s) => s.toggle);
  const items = useWishlistStore((s) => s.items);

  useEffect(() => setMounted(true), []);

  const active = mounted && items.some((i) => i.productId === item.productId);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const wasActive = active;
    toggle(item);
    toast.success(
      wasActive ? `${item.name} removed from wishlist` : `${item.name} saved to wishlist`
    );
  }

  if (display === "full") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={active}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border font-semibold text-sm transition-all duration-300",
          active
            ? "border-rose-200 bg-rose-50 text-rose-600"
            : "border-ink-100 bg-white text-ink hover:border-rose-200 hover:text-rose-600",
          className
        )}
      >
        <Heart className={cn("h-4 w-4 transition-transform", active && "fill-rose-500 text-rose-500 scale-110")} />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-all duration-300 shadow-sm",
        active
          ? "border-rose-200 bg-rose-50 text-rose-500"
          : "border-ink-50 bg-white/85 text-ink/50 hover:text-rose-500 hover:border-rose-200",
        className
      )}
    >
      <Heart className={cn("h-[18px] w-[18px] transition-transform", active && "fill-rose-500 scale-110")} />
    </button>
  );
}
