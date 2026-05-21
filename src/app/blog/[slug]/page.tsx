import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { getArticleBySlug, getArticleSlugs, getAllArticles, type ArticleBlock } from "@/lib/blog";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/site-url";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE_URL}/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      authors: [article.author],
      images: [{ url: article.cover, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.cover],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="text-2xl md:text-3xl font-sans font-bold text-ink mt-12 mb-2 scroll-mt-24">{block.text}</h2>;
    case "p":
      return <p className="font-serif text-lg text-ink/80 leading-relaxed">{block.text}</p>;
    case "ul":
      return (
        <ul className="list-disc pl-6 space-y-2 font-serif text-lg text-ink/80 leading-relaxed marker:text-terracotta">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-terracotta pl-6 py-1 font-serif text-xl italic text-ink/75">
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getAllArticles().filter((a) => a.slug !== article.slug).slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: `${SITE_URL}${article.cover}`,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: { "@type": "Organization", name: article.author, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Gandhi Brothers",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${article.slug}` },
    keywords: article.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/blog/${article.slug}` },
    ],
  };

  return (
    <article className="relative min-h-screen pb-24">
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-cream to-transparent -z-10" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/blog" }, { label: article.title }]}
        />

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {article.tags.map((t) => (
            <span key={t} className="text-[11px] font-bold text-terracotta uppercase tracking-widest bg-terracotta/8 rounded-full px-3 py-1">
              {t}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-5xl font-sans font-bold text-ink tracking-tight leading-[1.1]">
          {article.title}
        </h1>

        <div className="mt-5 flex items-center gap-4 text-sm text-ink/50">
          <span>By {article.author}</span>
          <span>·</span>
          <span>{formatDate(article.date)}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readMinutes} min read</span>
        </div>

        <div className="relative aspect-[16/9] mt-8 rounded-[2rem] overflow-hidden bg-gradient-to-br from-cream to-[#F7EFE8] border border-white shadow-lg">
          <Image
            src={article.cover}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-10 space-y-5">
          {article.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-[2rem] bg-gradient-to-r from-terracotta to-terracotta-600 text-cream px-8 py-10 text-center shadow-lg">
          <h2 className="text-2xl font-sans font-bold text-cream">Explore the catalogue</h2>
          <p className="mt-2 text-cream/85 font-serif max-w-md mx-auto">
            FDCA-licensed churnas and tailas, made in Junagadh and delivered across India.
          </p>
          <Button asChild variant="accent" size="lg" className="mt-6">
            <Link href="/products">Shop products <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-ink-100/60">
            <h2 className="text-xl font-sans font-bold text-ink mb-6">Keep reading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="group flex gap-4 items-center rounded-2xl border border-ink-50 bg-white p-4 hover:shadow-lg transition-all">
                  <div className="relative h-20 w-24 shrink-0 rounded-xl overflow-hidden bg-cream">
                    <Image src={a.cover} alt={a.title} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="font-sans font-bold text-sm text-ink leading-snug group-hover:text-terracotta transition-colors line-clamp-3">
                    {a.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to the Journal
          </Link>
        </div>
      </div>
    </article>
  );
}
