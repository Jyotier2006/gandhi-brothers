"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Minimal product snapshot needed to render a wishlist entry. */
export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  add: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) =>
          state.items.some((i) => i.productId === item.productId)
            ? state
            : { items: [...state.items, item] }
        ),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      toggle: (item) =>
        set((state) =>
          state.items.some((i) => i.productId === item.productId)
            ? { items: state.items.filter((i) => i.productId !== item.productId) }
            : { items: [...state.items, item] }
        ),

      has: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name: "gandhi-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
