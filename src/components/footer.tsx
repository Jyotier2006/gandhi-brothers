import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Leaf, MapPin, Phone, Mail, Instagram } from "lucide-react";

export default async function Footer() {
  const t = await getTranslations("footer");

  const SHOP_LINKS = [
    { label: t("allProducts"), href: "/products" },
    { label: t("churnas"), href: "/products?category=Churna" },
    { label: t("tailas"), href: "/products?category=Taila" },
  ];

  const COMPANY_LINKS = [
    { label: t("aboutUs"), href: "/about" },
    { label: t("journal"), href: "/blog" },
    { label: t("certifications"), href: "/certifications" },
    { label: t("faq"), href: "/faq" },
    { label: t("inquiries"), href: "/inquiry" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <footer className="relative bg-[#F9F7F3] border-t border-[#A69279]/15 text-[#4A3F35] overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] rounded-full bg-terracotta/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] rounded-full bg-mustard/5 blur-3xl pointer-events-none" />

      {/* Main Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Block */}
        <div className="space-y-6 pr-4">
          <Link href="/" className="group-hover:scale-105 transition-transform duration-300 w-fit">
            <Image
              src="/logo.png"
              alt="Gandhi Brothers"
              width={220}
              height={144}
              className="object-contain drop-shadow-transparent mix-blend-multiply opacity-95 hover:opacity-100 transition-opacity w-44 sm:w-56 h-auto"
            />
          </Link>
          <p className="text-sm text-ink/70 font-serif leading-relaxed h-full">
            {t("tagline")}
          </p>
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mustard/10 border border-mustard/20 text-xs text-mustard font-semibold tracking-wide">
            <Leaf className="h-3.5 w-3.5" />
            <span>{t("licence")}</span>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-ink font-sans font-bold text-sm uppercase tracking-widest mb-6 border-b border-ink/10 pb-2">
            {t("shopHeading")}
          </h3>
          <ul className="space-y-3.5">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink/70 hover:text-terracotta hover:translate-x-1 inline-block transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-ink font-sans font-bold text-sm uppercase tracking-widest mb-6 border-b border-ink/10 pb-2">
            {t("companyHeading")}
          </h3>
          <ul className="space-y-3.5">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink/70 hover:text-terracotta hover:translate-x-1 inline-block transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-ink font-sans font-bold text-sm uppercase tracking-widest mb-6 border-b border-ink/10 pb-2">
            {t("contactHeading")}
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3 text-ink/80 group">
              <div className="bg-ink/5 p-2 rounded-lg group-hover:bg-terracotta/10 transition-colors">
                <MapPin className="h-4 w-4 text-terracotta" />
              </div>
              <span className="font-serif leading-relaxed mt-1">
                Gomti Bhavan, Azad Chowk,
                <br />
                Junagadh – 362001, Gujarat
              </span>
            </li>
            <li>
              <a
                href="tel:+919106980909"
                className="flex items-center gap-3 text-ink/80 group hover:text-terracotta transition-colors"
              >
                <div className="bg-ink/5 p-2 rounded-lg group-hover:bg-terracotta/10 transition-colors">
                  <Phone className="h-4 w-4 text-terracotta" />
                </div>
                +91 91069 80909
              </a>
            </li>
            <li>
              <a
                href="mailto:support@gandhibrothers.co.in"
                className="flex items-center gap-3 text-ink/80 group hover:text-terracotta transition-colors"
              >
                <div className="bg-ink/5 p-2 rounded-lg group-hover:bg-terracotta/10 transition-colors">
                  <Mail className="h-4 w-4 text-terracotta" />
                </div>
                support@gandhibrothers.co.in
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/gandhi_brothers9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-ink/80 group hover:text-terracotta transition-colors"
              >
                <div className="bg-ink/5 p-2 rounded-lg group-hover:bg-terracotta/10 transition-colors">
                  <Instagram className="h-4 w-4 text-terracotta" />
                </div>
                @gandhi_brothers9
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 border-t border-ink/10" />

      {/* Bottom Row */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink/50 font-medium">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>

        <div className="flex items-center gap-6 flex-wrap justify-center">
          <Link href="/privacy-policy" className="hover:text-ink transition-colors">
            {t("privacy")}
          </Link>
          <Link href="/terms-of-service" className="hover:text-ink transition-colors">
            {t("terms")}
          </Link>
          <Link href="/shipping-policy" className="hover:text-ink transition-colors">
            {t("shipping")}
          </Link>
          <Link href="/refund-policy" className="hover:text-ink transition-colors">
            {t("refund")}
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="relative z-10 border-t border-terracotta/10 bg-terracotta/5 backdrop-blur-md text-center py-3 px-4 text-[11px] text-ink/60 font-serif tracking-wide">
        {t("disclaimer")}
      </div>
    </footer>
  );
}
