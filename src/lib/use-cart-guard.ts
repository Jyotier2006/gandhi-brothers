"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart-store";
import { useAuthGate, PENDING_CART_KEY } from "@/lib/store/auth-gate-store";
import type { CartItem } from "@/lib/types";

/**
 * Returns a guarded add-to-cart function.
 *
 * If the shopper is signed in, the item is added immediately (and, for Buy Now,
 * we continue to checkout). If they are signed out, we stash the intended action
 * in sessionStorage and open the Google sign-in popup — after they sign in,
 * {@link PendingCartReplay} replays the stashed action automatically.
 */
export function useCartGuard() {
  const { status } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const openGate = useAuthGate((s) => s.openGate);
  const router = useRouter();

  return useCallback(
    (item: CartItem, opts?: { buyNow?: boolean }) => {
      if (status === "authenticated") {
        addItem(item);
        if (opts?.buyNow) {
          router.push("/checkout");
        } else {
          toast.success(`${item.name} added to cart`);
        }
        return;
      }

      // Signed out (or session still resolving) → remember the intent, prompt sign-in.
      try {
        sessionStorage.setItem(
          PENDING_CART_KEY,
          JSON.stringify({ item, buyNow: !!opts?.buyNow })
        );
      } catch {
        /* sessionStorage unavailable — fall through to the popup anyway */
      }
      openGate(
        opts?.buyNow
          ? "Sign in with Google to continue to checkout"
          : "Sign in with Google to add items to your cart"
      );
    },
    [status, addItem, openGate, router]
  );
}
