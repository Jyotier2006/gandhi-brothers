"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  // Prevent SSR/CSR mismatch 
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-terracotta relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-[#F7EFE8] z-0" />
        <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
          <div className="h-16 w-16 rounded-3xl bg-terracotta/10 flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-terracotta" />
          </div>
          <p className="font-semibold tracking-widest uppercase text-sm">Securely loading cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-lg mx-auto text-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cream via-transparent to-transparent -z-10" />
        
        <div className="relative h-28 w-28 rounded-[2rem] bg-gradient-to-br from-white to-cream shadow-2xl flex items-center justify-center mb-8 border border-white">
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta/20 to-mustard/20 blur-xl opacity-60 rounded-full" />
          <ShoppingBag className="relative z-10 h-12 w-12 text-terracotta drop-shadow-md" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink mb-4 tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-ink-400 font-serif text-lg mb-10 max-w-sm">
          Discover our classical formulations crafted for holistic well-being.
        </p>
        
        <Link href="/products" className="group">
          <Button size="lg" className="h-14 px-10 rounded-full text-base shadow-xl shadow-terracotta/30 hover:shadow-terracotta/40 transition-all duration-300">
            Browse Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();

  return (
    <div className="relative min-h-screen pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cream to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink tracking-tight pb-2">Shopping Cart</h1>
          <div className="h-1.5 w-16 bg-gradient-to-r from-terracotta to-mustard rounded-full mx-auto lg:mx-0 mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ── LEFT: LINE ITEMS ────────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group flex gap-4 sm:gap-6 p-4 sm:p-5 bg-white/60 backdrop-blur-md hover:bg-white border border-white hover:border-ink-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all duration-300"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-cream to-[#F7EFE8] shrink-0 block border border-ink-50/50 shadow-inner group-hover:shadow-md transition-shadow"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="128px"
                    className="object-contain p-2 hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                {/* Product Info & Controls */}
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-sans font-bold text-lg text-ink line-clamp-2 leading-tight hover:text-terracotta transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="font-semibold text-terracotta mt-1.5 text-lg">
                        {formatINR(item.price)}
                      </div>
                    </div>
                    
                    {/* Remove Item Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 sm:p-2.5 text-ink-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 mt-[-4px]"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-xl border border-ink-100/60 bg-white shadow-sm overflow-hidden h-10 w-fit">
                      <button
                        className="flex h-full w-10 items-center justify-center text-ink hover:bg-terracotta hover:text-white transition-colors"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="px-4 min-w-[3rem] text-center font-bold text-sm bg-cream/30 flex items-center justify-center">
                        {item.quantity}
                      </div>
                      <button
                        className="flex h-full w-10 items-center justify-center text-ink hover:bg-terracotta hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm font-bold text-ink">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── RIGHT: SUMMARY ──────────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-2xl shadow-ink/5">
              
              <h2 className="text-2xl font-bold font-sans text-ink mb-6 flex items-center gap-3">
                Order Summary
              </h2>

              <div className="space-y-4 text-[15px] font-medium text-ink/80 mb-6 border-b border-ink-100/50 pb-6">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-bold text-ink">{formatINR(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="text-xs font-semibold text-ink/50 italic">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-2">
                <div>
                  <span className="block text-sm text-ink/50 font-bold uppercase tracking-wider mb-1">Subtotal</span>
                  <span className="text-xs text-ink/40">Shipping added at checkout</span>
                </div>
                <span className="text-3xl font-extrabold text-ink tracking-tight">
                  {formatINR(subtotal)}
                </span>
              </div>

              <Link href="/checkout" className="block group">
                <Button size="lg" className="h-14 w-full rounded-2xl text-lg shadow-xl shadow-terracotta/20 bg-ink hover:bg-terracotta transition-all duration-300">
                  Proceed to checkout
                </Button>
              </Link>
              
              <Link href="/products" className="block mt-4 text-center">
                <Button variant="ghost" className="text-ink-400 hover:text-ink w-full rounded-2xl h-12">
                  Continue shopping
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
