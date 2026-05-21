import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getAllArticles } from "@/lib/blog";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Journal — Ayurveda, Explained Plainly",
  description:
    "Educational articles from Gandhi Brothers on Ayurveda: what FDCA licensing means, the classical preparation forms, and how our products are made in Junagadh.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal | Gandhi Brothers",
    description:
      "Educational articles on Ayurveda: FDCA licensing, classical preparation forms, and how our products are made in Junagadh.",
    url: "/blog",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const articles = getAllArticles();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Gandhi Brothers Journal",
    url: `${SITE_URL}/blog`,
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE_URL}/blog/${a.slug}`,
      datePublished: a.date,
      author: { "@type": "Organization", name: a.author },
    })),
  };

  const [lead, ...rest] = articles;

  return (
    <div className="relative min-h-screen pb-24">
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-cream to-transparent -z-10" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Breadcrumbs className="mb-8" items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />

        <header className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink tracking-tight">The Journal</h1>
          <div className="h-1.5 w-16 bg-gradient-to-r from-terracotta to-mustard rounded-full mt-4" />
          <p className="mt-6 font-serif text-lg text-ink/75 leading-relaxed">
            Ayurveda, explained plainly — what the labels mean, how the classical forms differ, and what
            actually happens between a raw herb and a sealed pouch.
          </p>
        </header>

        {/* Lead article */}
        {lead && (
          <Link
            href={`/blog/${lead.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 rounded-[2rem] overflow-hidden bg-white border border-ink-50 shadow-sm hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[20rem] overflow-hidden bg-gradient-to-br from-cream to-[#F7EFE8]">
              <Image
                src={lead.cover}
                alt={lead.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:pr-12">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {lead.tags.map((t) => (
                  <span key={t} className="text-[11px] font-bold text-terracotta uppercase tracking-widest bg-terracotta/8 rounded-full px-3 py-1">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-ink leading-tight group-hover:text-terracotta transition-colors">
                {lead.title}
              </h2>
              <p className="mt-4 font-serif text-ink/70 leading-relaxed line-clamp-3">{lead.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-sm text-ink/50">
                <span>{formatDate(lead.date)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {lead.readMinutes} min read</span>
                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-terracotta group-hover:gap-2 transition-all">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-ink-50 shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-cream to-[#F7EFE8]">
                  <Image
                    src={a.cover}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {a.tags.slice(0, 1).map((t) => (
                      <span key={t} className="text-[10px] font-bold text-terracotta uppercase tracking-widest bg-terracotta/8 rounded-full px-2.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-sans font-bold text-lg text-ink leading-tight group-hover:text-terracotta transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="mt-2 font-serif text-sm text-ink/70 leading-relaxed line-clamp-3 flex-grow">{a.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink/50">
                    <span>{formatDate(a.date)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
