"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart-store";
import { useAuthGate, PENDING_CART_KEY } from "@/lib/store/auth-gate-store";

/**
 * After a successful Google sign-in the page reloads; once the session is
 * authenticated we replay the add-to-cart action the shopper attempted while
 * signed out (stashed by useCartGuard), then close the sign-in popup.
 * Mounted once, globally, in the root layout.
 */
export function PendingCartReplay() {
  const { status } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const closeGate = useAuthGate((s) => s.closeGate);
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(PENDING_CART_KEY);
    } catch {
      return;
    }
    // Signing in resolved an open gate even if there's nothing to replay.
    closeGate();
    if (!raw) return;

    try {
      sessionStorage.removeItem(PENDING_CART_KEY);
    } catch {
      /* ignore */
    }

    try {
      const { item, buyNow } = JSON.parse(raw);
      if (item?.productId) {
        addItem(item);
        toast.success(`${item.name} added to cart`);
        if (buyNow) router.push("/checkout");
      }
    } catch {
      /* malformed payload — ignore */
    }
  }, [status, addItem, closeGate, router]);

  return null;
}
