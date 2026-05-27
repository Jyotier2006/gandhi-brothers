"use client";

import { create } from "zustand";

/** Controls the "Sign in to continue" popup shown when a signed-out shopper
 *  tries to add to cart / buy now. */
interface AuthGateStore {
  open: boolean;
  message: string;
  openGate: (message?: string) => void;
  closeGate: () => void;
}

export const useAuthGate = create<AuthGateStore>((set) => ({
  open: false,
  message: "",
  openGate: (message = "Sign in with Google to continue") =>
    set({ open: true, message }),
  closeGate: () => set({ open: false }),
}));

/** sessionStorage key holding the cart action to replay after a successful sign-in. */
export const PENDING_CART_KEY = "gandhi-pending-cart";
