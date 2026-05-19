"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// ─── Shared filter fields ─────────────────────────────────────────────────────
function FilterFields({
  query, setQuery,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  searchParams,
  update, handleSearchCommit, handleClear,
  onClose,
}: {
  query: string; setQuery: (v: string) => void;
  minPrice: string; setMinPrice: (v: string) => void;
  maxPrice: string; setMaxPrice: (v: string) => void;
  searchParams: URLSearchParams;
  update: (k: string, v: string | undefined) => void;
  handleSearchCommit: (e: React.FormEvent) => void;
  handleClear: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-ink uppercase tracking-widest">Search</Label>
        <form onSubmit={handleSearchCommit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search formulations..."
            className="pl-10 h-11 rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink placeholder:text-ink/40 focus-visible:ring-[#D4A351]/40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => update("q", query)}
          />
        </form>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-ink uppercase tracking-widest">Category</Label>
        <Select
          value={searchParams.get("category") || "All"}
          onValueChange={(val) => update("category", val)}
        >
          <SelectTrigger className="h-11 w-full rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink focus:ring-[#D4A351]/40">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl bg-white border-white/60">
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Churna">Churna</SelectItem>
            <SelectItem value="Taila">Taila</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-ink uppercase tracking-widest">Price Range (₹)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number" placeholder="Min" min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => update("min", minPrice)}
            className="h-11 rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink placeholder:text-ink/40 text-center focus-visible:ring-[#D4A351]/40"
          />
          <span className="text-ink/40 font-bold shrink-0">–</span>
          <Input
            type="number" placeholder="Max" min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => update("max", maxPrice)}
            className="h-11 rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink placeholder:text-ink/40 text-center focus-visible:ring-[#D4A351]/40"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-ink uppercase tracking-widest">Sort</Label>
        <Select
          value={searchParams.get("sort") || "latest"}
          onValueChange={(val) => update("sort", val)}
        >
          <SelectTrigger className="h-11 w-full rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink focus:ring-[#D4A351]/40">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl bg-white border-white/60">
            <SelectItem value="latest">Newest Arrivals</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          variant="outline"
          onClick={() => { handleClear(); onClose?.(); }}
          className="flex-1 h-11 rounded-xl border-[#A69279]/30 text-ink hover:text-[#A69279] hover:border-[#A69279]"
        >
          Reset
        </Button>
        {onClose && (
          <Button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#A69279] hover:bg-[#89765D] text-white"
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const update = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "" && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchCommit = (e: React.FormEvent) => {
    e.preventDefault();
    update("q", query);
  };

  const handleClear = () => {
    setQuery(""); setMinPrice(""); setMaxPrice("");
    router.push(pathname);
  };

  const activeCount = [
    searchParams.get("q"),
    searchParams.get("category"),
    searchParams.get("min"),
    searchParams.get("max"),
  ].filter(Boolean).length;

  const sharedProps = { query, setQuery, minPrice, setMinPrice, maxPrice, setMaxPrice, searchParams, update, handleSearchCommit, handleClear };

  return (
    <>
      {/* ── Mobile: Filter trigger button ─────────────────────────────── */}
      <div className="md:hidden mb-5 flex items-center gap-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-white border border-[#A69279]/25 shadow-sm
                     text-sm font-semibold text-ink
                     hover:border-[#D4A351]/50 hover:bg-[#F9F7F3]
                     transition-all duration-200 active:scale-95"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#A69279]" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full
                             bg-[#D4A351] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {/* Active filter chips */}
        {searchParams.get("category") && (
          <span className="text-xs px-3 py-1 rounded-full bg-[#A69279]/10 text-[#A69279] font-semibold border border-[#A69279]/20">
            {searchParams.get("category")}
          </span>
        )}
        {(searchParams.get("min") || searchParams.get("max")) && (
          <span className="text-xs px-3 py-1 rounded-full bg-[#A69279]/10 text-[#A69279] font-semibold border border-[#A69279]/20">
            ₹{searchParams.get("min") || "0"} – ₹{searchParams.get("max") || "∞"}
          </span>
        )}
      </div>

      {/* ── Mobile: Slide-in drawer ────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
                    transition-opacity duration-300
                    ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDrawerOpen(false)}
      />
      {/* Drawer panel */}
      <div
        className={`md:hidden fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-sm
                    bg-white shadow-2xl flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#A69279]/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#A69279]" />
            <span className="font-bold text-ink text-base">Filters</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-[#F9F7F3] text-ink/60 hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <FilterFields {...sharedProps} onClose={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* ── Desktop: Inline panel (hidden on mobile) ───────────────────── */}
      <div className="hidden md:block bg-white border border-[#A69279]/12 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          {/* Search */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-ink uppercase tracking-widest">Search</Label>
            <form onSubmit={handleSearchCommit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
              <Input
                type="text" placeholder="Search formulations..."
                className="pl-10 h-11 rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink placeholder:text-ink/40 focus-visible:ring-[#D4A351]/40"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => update("q", query)}
              />
            </form>
          </div>
          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-ink uppercase tracking-widest">Category</Label>
            <Select value={searchParams.get("category") || "All"} onValueChange={(val) => update("category", val)}>
              <SelectTrigger className="h-11 w-full rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink focus:ring-[#D4A351]/40">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl bg-white">
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Churna">Churna</SelectItem>
                <SelectItem value="Taila">Taila</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Price */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-ink uppercase tracking-widest">Price Range (₹)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Min" min="0" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)} onBlur={() => update("min", minPrice)}
                className="h-11 rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink text-center focus-visible:ring-[#D4A351]/40" />
              <span className="text-ink/40 font-bold shrink-0">–</span>
              <Input type="number" placeholder="Max" min="0" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)} onBlur={() => update("max", maxPrice)}
                className="h-11 rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink text-center focus-visible:ring-[#D4A351]/40" />
            </div>
          </div>
          {/* Sort + Reset */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-ink uppercase tracking-widest">Sort</Label>
            <div className="flex gap-2">
              <Select value={searchParams.get("sort") || "latest"} onValueChange={(val) => update("sort", val)}>
                <SelectTrigger className="h-11 flex-1 rounded-xl bg-[#F9F7F3] border-[#A69279]/20 text-ink focus:ring-[#D4A351]/40">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl bg-white">
                  <SelectItem value="latest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleClear}
                className="h-11 px-4 rounded-xl border-[#A69279]/30 text-ink hover:text-[#A69279] hover:border-[#A69279] shrink-0">
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
