import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { PendingCartReplay } from "@/components/auth/pending-cart-replay";
import { SITE_URL } from "@/lib/site-url";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const SITE_NAME = "Gandhi Brothers";
const SITE_DESCRIPTION =
  "FDCA-licensed Ayurvedic products by Gandhi Brothers, Junagadh (Licence GA/2079). Shop authentic Churnas, Tailas and classical formulations, made the right way since 1950.";

export const metadata: Metadata = {
  title: {
    template: "%s | Gandhi Brothers",
    default: "Gandhi Brothers — Ayurvedic Manufacturer, Junagadh",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  keywords: [
    "Ayurvedic medicine",
    "Churna",
    "Taila",
    "Ayurveda Junagadh",
    "FDCA licensed Ayurvedic manufacturer",
    "Gandhi Brothers",
    "classical Ayurvedic formulations",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
    // hreflang — tells Google about the language variants of the home page.
    languages: {
      en: "/",
      hi: "/hi",
      gu: "/gu",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Search Console / Bing ownership verification. Paste the tokens into .env.local
  // (GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION) — meta tags render only if set.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {},
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Gandhi Brothers — Ayurvedic Manufacturer, Junagadh",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Gandhi Brothers — Ayurvedic Manufacturer, Junagadh",
    description: SITE_DESCRIPTION,
  },
  category: "shopping",
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  // Brand variants help Google connect every way people search for you to one entity.
  alternateName: [
    "Gandhi Brothers Ayurveda",
    "Gandhi Brothers Junagadh",
    "Gandhi Brothers Ayurvedic",
    "JGV",
  ],
  legalName: SITE_NAME,
  slogan: "Rooted in tradition. Crafted for today.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "1950",
  foundingLocation: "Junagadh, Gujarat, India",
  areaServed: "IN",
  knowsAbout: ["Ayurveda", "Ayurvedic Churna", "Ayurvedic Taila", "Classical Ayurvedic formulations"],
  sameAs: ["https://instagram.com/gandhi_brothers9"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gomti Bhavan, Azad Chowk",
    addressLocality: "Junagadh",
    addressRegion: "Gujarat",
    postalCode: "362001",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-91069-80909",
    contactType: "customer service",
    email: "support@gandhibrothers.co.in",
    areaServed: "IN",
    availableLanguage: ["en", "hi", "gu"],
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// Local SEO — helps "ayurvedic manufacturer / store in Junagadh" style queries
// and Google Maps / local pack eligibility.
const STORE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  telephone: "+91-91069-80909",
  email: "support@gandhibrothers.co.in",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
  areaServed: "IN",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gomti Bhavan, Azad Chowk",
    addressLocality: "Junagadh",
    addressRegion: "Gujarat",
    postalCode: "362001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 21.5222,
    longitude: 70.4579,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  sameAs: ["https://instagram.com/gandhi_brothers9"],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Enables static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${poppins.variable} ${lora.variable}`}>
      <head>
        {/* Without JS, scroll-reveal elements must never stay hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col bg-cream text-ink font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <NextIntlClientProvider>
        <Providers>
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
          <SignInModal />
          <PendingCartReplay />
        </Providers>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STORE_JSON_LD) }}
        />
      </body>
    </html>
  );
}
