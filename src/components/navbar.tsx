"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Bulk Order", href: "/bulk-order" },
  { label: "Churnas", href: "/products?category=Churna" },
  { label: "Capsules", href: "/products?category=Capsule" },
  { label: "Arishtas", href: "/products?category=Arishta" },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemCount = useCartStore((s) => s.getItemCount);

  useEffect(() => {
    setHydrated(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        // Navbar background is cream (#F9F7F3) — exactly matches logo white canvas
        // so logo blends perfectly without any harsh edge
        scrolled
          ? "bg-[#F9F7F3]/95 shadow-sm shadow-[#A69279]/10 backdrop-blur-md border-b border-[#A69279]/10"
          : "bg-[#F9F7F3] border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-[72px] items-center gap-6">

        {/* ── Logo − mix-blend-mode:multiply removes white background ── */}
        <Link href="/" className="shrink-0 flex items-center">
          {/* mix-blend-mode: multiply → white pixels become transparent,
              the taupe/gold brand colors merge naturally with the cream navbar */}
          <Image
            src="/logo.png"
            alt="Gandhi Brothers"
            width={449}
            height={251}
            className="h-14 w-auto mix-blend-multiply drop-shadow-none"
            priority
          />
        </Link>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-sm font-semibold text-[#4A3F35]/70 hover:text-[#A69279] px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#A69279]/8 group"
            >
              {link.label}
              {/* Animated underline in gold */}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#D4A351] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
            </Link>
          ))}
        </nav>

        {/* ── Search ── */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center gap-2 rounded-full border border-[#A69279]/25 bg-white/70 px-3.5 py-2 text-sm focus-within:ring-2 focus-within:ring-[#D4A351]/40 focus-within:border-[#D4A351]/50 focus-within:bg-white transition-all duration-300 group shadow-sm shadow-[#A69279]/5"
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-[#A69279]/60 group-focus-within:text-[#D4A351] transition-colors duration-300" />
          <input
            type="search"
            placeholder="Search catalogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 lg:w-48 border-none bg-transparent font-medium text-[#4A3F35] placeholder:text-[#A69279]/50 focus:outline-none text-sm"
          />
        </form>

        {/* ── Cart ── */}
        <Link
          href="/cart"
          aria-label="Shopping cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#A69279]/25 bg-white/70 shadow-sm text-[#4A3F35] hover:text-[#A69279] hover:bg-white hover:border-[#D4A351]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {hydrated && cartItemCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#A69279] to-[#D4A351] text-[10px] font-bold text-white shadow border-2 border-[#F9F7F3] animate-in zoom-in-50 duration-300">
              {cartItemCount()}
            </span>
          )}
        </Link>

        {/* ── Mobile Toggle ── */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[#A69279]/25 bg-white/70 text-[#4A3F35] hover:bg-white hover:text-[#A69279] transition-all"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {/* Backdrop — sits behind the panel, dims page content */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-[72px] z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Panel — fully opaque, floats above everything */}
      <div
        className={cn(
          "md:hidden fixed left-0 right-0 top-[72px] z-50",
          "bg-white border-b border-[#A69279]/15 shadow-2xl shadow-black/15",
          "transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-5 py-5 space-y-3">
          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 rounded-xl border border-[#A69279]/25 bg-[#F9F7F3] px-4 py-3 focus-within:ring-2 focus-within:ring-[#D4A351]/40"
          >
            <Search className="h-4 w-4 text-[#A69279] shrink-0" />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent font-medium text-[#4A3F35] placeholder:text-[#A69279]/60 focus:outline-none text-sm border-none"
            />
          </form>
          {/* Mobile Nav Links */}
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3.5 text-base font-semibold text-[#4A3F35] hover:text-[#A69279] hover:bg-[#F9F7F3] rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#A69279]/10">
            <p className="text-center text-xs text-[#A69279] font-semibold py-2">
              FDCA Licensed · GA/2079
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
