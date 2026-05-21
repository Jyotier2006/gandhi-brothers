import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";

/** Shared shell for the static legal/policy pages, matching the site's editorial style. */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen pb-24">
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-cream to-transparent -z-10" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: title }]}
        />
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink tracking-tight">{title}</h1>
        <div className="h-1.5 w-16 bg-gradient-to-r from-terracotta to-mustard rounded-full mt-4" />
        <p className="text-sm text-ink/40 mt-4 font-medium">Last updated: {updated}</p>
        {intro && <p className="mt-6 font-serif text-lg text-ink/75 leading-relaxed">{intro}</p>}
        <div className="mt-10 space-y-10">{children}</div>

        <div className="mt-16 rounded-2xl bg-cream border border-terracotta/15 p-6 text-sm text-ink/70 font-serif leading-relaxed">
          Questions about this policy? Write to{" "}
          <a href="mailto:support@gandhibrothers.co.in" className="text-terracotta font-semibold hover:underline">
            support@gandhibrothers.co.in
          </a>{" "}
          or call{" "}
          <a href="tel:+919106980909" className="text-terracotta font-semibold hover:underline">
            +91 91069 80909
          </a>
          . You can also reach us through our{" "}
          <Link href="/contact" className="text-terracotta font-semibold hover:underline">
            contact page
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl md:text-2xl font-sans font-bold text-ink">{heading}</h2>
      <div className="space-y-3 font-serif text-ink/75 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-terracotta [&_a]:font-semibold hover:[&_a]:underline">
        {children}
      </div>
    </section>
  );
}
