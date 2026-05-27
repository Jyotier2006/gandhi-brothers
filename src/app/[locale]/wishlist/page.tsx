"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WishlistPage() {
  const [hydrated, setHydrated] = useState(false);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-rose-400">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Heart className="h-10 w-10" />
          <p className="font-semibold tracking-widest uppercase text-sm">Loading your wishlist…</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-lg mx-auto text-center px-4">
        <div className="relative h-28 w-28 rounded-[2rem] bg-gradient-to-br from-white to-cream shadow-2xl flex items-center justify-center mb-8 border border-white">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-200/40 to-mustard/20 blur-xl opacity-60 rounded-full" />
          <Heart className="relative z-10 h-12 w-12 text-rose-400 drop-shadow-md" />
        </div>
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink mb-4 tracking-tight">
          Your wishlist is empty
        </h1>
        <p className="text-ink-400 font-serif text-lg mb-10 max-w-sm">
          Tap the heart on any product to save it here for later.
        </p>
        <Link href="/products">
          <Button size="lg" className="h-14 px-10 rounded-full text-base shadow-xl shadow-terracotta/30 hover:shadow-terracotta/40 transition-all duration-300">
            Browse Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  function moveToCart(item: (typeof items)[number]) {
    addItem({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: 99, // listing-level snapshot; checkout re-validates against live stock
    });
    remove(item.productId);
    toast.success(`${item.name} moved to cart`);
  }

  return (
    <div className="relative min-h-screen pb-20">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cream to-transparent -z-10" />

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink tracking-tight pb-2 flex items-center gap-3 justify-center lg:justify-start">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            Wishlist
          </h1>
          <div className="h-1.5 w-16 bg-gradient-to-r from-rose-400 to-mustard rounded-full mx-auto lg:mx-0 mt-4" />
          <p className="text-ink-400 mt-3">{items.length} saved {items.length === 1 ? "item" : "items"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group relative flex gap-4 p-4 bg-white/70 backdrop-blur-md border border-white hover:border-ink-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all duration-300"
            >
              <button
                onClick={() => remove(item.productId)}
                aria-label={`Remove ${item.name} from wishlist`}
                className="absolute top-3 right-3 p-2 text-ink-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <Link
                href={`/products/${item.slug}`}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-cream to-[#F7EFE8] shrink-0 block border border-ink-50/50"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                  unoptimized={item.image.endsWith(".svg")}
                />
              </Link>

              <div className="flex flex-col flex-1 justify-between py-1 pr-6">
                <div>
                  <p className="text-[11px] font-bold text-terracotta/80 uppercase tracking-widest mb-1">
                    {item.category}
                  </p>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-sans font-bold text-base text-ink line-clamp-2 leading-tight hover:text-terracotta transition-colors"
                  >
                    {item.name}
                  </Link>
                  <div className="font-semibold text-terracotta mt-1.5">{formatINR(item.price)}</div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => moveToCart(item)}
                    className="rounded-xl bg-ink hover:bg-terracotta text-white text-xs font-bold h-9"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Move to cart
                  </Button>
                  <button
                    onClick={() => remove(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-100 text-ink-300 hover:text-rose-500 hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/products">
            <Button variant="ghost" className="text-ink-400 hover:text-ink rounded-2xl h-12 px-8">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
