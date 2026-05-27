import { defineRouting } from "next-intl/routing";

/**
 * Locale routing for the storefront.
 *  - English stays at the root (no /en prefix) — `as-needed`.
 *  - Hindi  → /hi/...   Gujarati → /gu/...
 */
export const routing = defineRouting({
  locales: ["en", "hi", "gu"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];

/** Human-readable names for the language switcher. */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  hi: "हिन्दी",
  gu: "ગુજરાતી",
};
