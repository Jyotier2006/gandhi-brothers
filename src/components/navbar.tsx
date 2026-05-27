"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { ShoppingCart, Search, Menu, X, Heart, LogOut, LogIn, Package, Globe, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, LOCALE_LABELS, type AppLocale } from "@/i18n/routing";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "shop", href: "/products" },
  { key: "journal", href: "/blog" },
  { key: "heritage", href: "/heritage" },
  { key: "inquiries", href: "/inquiry" },
] as const;

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("nav");
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemCount = useCartStore((s) => s.getItemCount);
  const wishlistCount = useWishlistStore((s) => s.count);

  const isAuthed = status === "authenticated";
  const user = session?.user;

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

  // Switch language while staying on the current page (query is dropped).
  const switchLocale = (next: AppLocale) => {
    router.replace(pathname, { locale: next });
    setLangOpen(false);
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-[#F9F7F3]/95 shadow-sm shadow-[#A69279]/10 backdrop-blur-md border-b border-[#A69279]/10"
          : "bg-[#F9F7F3] border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-[72px] items-center gap-6">

        {/* ── Logo ── */}
        <Link href="/" className="shrink-0 flex items-center">
          <Image
            src="/logo.png"
            alt="Gandhi Brothers"
            width={449}
            height={251}
            className="h-14 w-auto mix-blend-multiply drop-shadow-none"
            priority
          />
        </Link>

        <div className="flex-1" />

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="relative text-sm font-semibold text-[#4A3F35]/70 hover:text-[#A69279] px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#A69279]/8 group"
            >
              {t(link.key)}
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
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 lg:w-48 border-none bg-transparent font-medium text-[#4A3F35] placeholder:text-[#A69279]/50 focus:outline-none text-sm"
          />
        </form>

        {/* ── Language switcher (desktop) ── */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setLangOpen((o) => !o)}
            aria-label={t("language")}
            aria-expanded={langOpen}
            className="flex items-center gap-1.5 rounded-full border border-[#A69279]/25 bg-white/70 px-3 py-2 text-sm font-semibold text-[#4A3F35] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A351]/40 hover:bg-white hover:text-[#A69279] hover:shadow-md"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden lg:inline">{LOCALE_LABELS[locale]}</span>
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-[#A69279]/15 bg-white shadow-2xl shadow-black/10">
                {routing.locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#4A3F35] transition-colors hover:bg-[#F9F7F3] hover:text-[#A69279]"
                  >
                    {LOCALE_LABELS[l]}
                    {l === locale && <Check className="h-4 w-4 text-[#A69279]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Wishlist ── */}
        <Link
          href="/wishlist"
          aria-label={t("wishlist")}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#A69279]/25 bg-white/70 shadow-sm text-[#4A3F35] hover:text-rose-500 hover:bg-white hover:border-rose-300/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
        >
          <Heart className="h-[18px] w-[18px]" />
          {hydrated && wishlistCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow border-2 border-[#F9F7F3] animate-in zoom-in-50 duration-300">
              {wishlistCount()}
            </span>
          )}
        </Link>

        {/* ── Cart ── */}
        <Link
          href="/cart"
          aria-label={t("cart")}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#A69279]/25 bg-white/70 shadow-sm text-[#4A3F35] hover:text-[#A69279] hover:bg-white hover:border-[#D4A351]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {hydrated && cartItemCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#A69279] to-[#D4A351] text-[10px] font-bold text-white shadow border-2 border-[#F9F7F3] animate-in zoom-in-50 duration-300">
              {cartItemCount()}
            </span>
          )}
        </Link>

        {/* ── Account (Sign in / avatar + logout) ── */}
        {hydrated && (
          <div className="relative hidden md:block">
            {isAuthed ? (
              <>
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-label={t("account")}
                  aria-expanded={accountOpen}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#A69279]/25 bg-white/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A351]/40 hover:shadow-md"
                >
                  {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name ?? "Account"}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#A69279]">
                      {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-[#A69279]/15 bg-white shadow-2xl shadow-black/10">
                      <div className="border-b border-[#A69279]/10 px-4 py-3">
                        <p className="truncate text-sm font-bold text-[#4A3F35]">{user?.name ?? "Signed in"}</p>
                        {user?.email && (
                          <p className="truncate text-xs text-[#A69279]">{user.email}</p>
                        )}
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountOpen(false)}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-[#4A3F35] transition-colors hover:bg-[#F9F7F3] hover:text-[#A69279]"
                      >
                        <Package className="h-4 w-4" />
                        {t("myOrders")}
                      </Link>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2 border-t border-[#A69279]/10 px-4 py-3 text-sm font-semibold text-[#4A3F35] transition-colors hover:bg-[#F9F7F3] hover:text-rose-600"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("logout")}
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 rounded-full border border-[#A69279]/25 bg-white/70 px-4 py-2 text-sm font-semibold text-[#4A3F35] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A351]/40 hover:bg-white hover:text-[#A69279] hover:shadow-md"
              >
                <LogIn className="h-4 w-4" />
                {t("signIn")}
              </button>
            )}
          </div>
        )}

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
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-[72px] z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "md:hidden fixed left-0 right-0 top-[72px] z-50",
          "bg-white border-b border-[#A69279]/15 shadow-2xl shadow-black/15",
          "transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-[88vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 pointer-events-none"
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
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent font-medium text-[#4A3F35] placeholder:text-[#A69279]/60 focus:outline-none text-sm border-none"
            />
          </form>
          {/* Mobile Nav Links */}
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3.5 text-base font-semibold text-[#4A3F35] hover:text-[#A69279] hover:bg-[#F9F7F3] rounded-xl transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Mobile language switcher */}
          <div className="pt-2 border-t border-[#A69279]/10">
            <p className="px-4 pt-1 pb-2 text-xs font-bold uppercase tracking-widest text-[#A69279] flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> {t("language")}
            </p>
            <div className="flex flex-wrap gap-2 px-4">
              {routing.locales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    l === locale
                      ? "border-[#A69279] bg-[#A69279]/10 text-[#A69279]"
                      : "border-[#A69279]/25 text-[#4A3F35] hover:bg-[#F9F7F3]"
                  )}
                >
                  {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile account */}
          {hydrated && (
            <div className="pt-2 border-t border-[#A69279]/10">
              {isAuthed ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name ?? "Account"}
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F9F7F3] text-sm font-bold text-[#A69279]">
                        {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#4A3F35]">{user?.name ?? "Signed in"}</p>
                      {user?.email && <p className="truncate text-xs text-[#A69279]">{user.email}</p>}
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-[#4A3F35] transition-colors hover:bg-[#F9F7F3] hover:text-[#A69279]"
                  >
                    <Package className="h-4 w-4" />
                    {t("myOrders")}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-[#4A3F35] transition-colors hover:bg-[#F9F7F3] hover:text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signIn("google");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-[#4A3F35] transition-colors hover:bg-[#F9F7F3] hover:text-[#A69279]"
                >
                  <LogIn className="h-4 w-4" />
                  {t("signInGoogle")}
                </button>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-[#A69279]/10">
            <p className="text-center text-xs text-[#A69279] font-semibold py-2">
              {t("licensed")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
