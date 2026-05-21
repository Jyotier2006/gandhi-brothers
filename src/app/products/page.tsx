/**
 * Products listing page — groups SKUs by base product name.
 */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { searchGroupedProducts } from '@/lib/products';
import { ProductGroupCard } from '@/components/product-group-card';
import { ProductGridSkeleton } from '@/components/product-card-skeleton';
import { ProductFilters } from '@/components/product-filters';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gandhibrothers.co.in';

type SearchParams = {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
};

/** Per-category SEO + landing copy. Unique content helps these pages rank. */
const CATEGORY_SEO: Record<
  string,
  { title: string; description: string; h1: string; intro: string }
> = {
  Churna: {
    title: 'Ayurvedic Churnas (Herbal Powders) — Buy Online',
    description:
      'Shop classical Ayurvedic Churnas from Gandhi Brothers — single-herb and polyherbal powders, FDCA-licensed and made in Junagadh. Multiple pack sizes, delivered across India.',
    h1: 'Ayurvedic Churnas',
    intro:
      'Churnas are finely-ground herbal powders — the oldest and most versatile form in Ayurveda. Each of ours is prepared in small batches from carefully sourced dravyas, sieved to a consistent grade, and packed under our FDCA licence in Junagadh. Choose your pack size on any product below.',
  },
  Taila: {
    title: 'Ayurvedic Tailas (Medicated Oils) — Buy Online',
    description:
      'Shop classical Ayurvedic Tailas (medicated oils) from Gandhi Brothers — slow-cooked the traditional way, FDCA-licensed, made in Junagadh and delivered across India.',
    h1: 'Ayurvedic Tailas',
    intro:
      'Tailas are medicated oils, prepared by slow-cooking herbs into a base oil so their properties carry through. Ours follow classical methods under our FDCA licence in Junagadh. Browse the range below and pick the size that suits you.',
  },
};

const DEFAULT_SEO = {
  title: 'Shop Ayurvedic Churnas & Tailas',
  description:
    'Browse the complete Gandhi Brothers catalogue of FDCA-licensed Ayurvedic Churnas and Tailas. Classical formulations made in Junagadh and delivered across India.',
  h1: 'Shop Ayurvedic Churnas & Tailas',
  intro: 'Every Gandhi Brothers formulation, made the right way in Junagadh and shipped across India.',
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { q, category } = await searchParams;

  // Search-result pages are thin/near-duplicate — keep them out of the index.
  if (q) {
    return {
      title: `Search: ${q}`,
      description: `Search results for “${q}” in the Gandhi Brothers Ayurvedic catalogue.`,
      robots: { index: false, follow: true },
      alternates: { canonical: '/products' },
    };
  }

  if (category && CATEGORY_SEO[category]) {
    const c = CATEGORY_SEO[category];
    const url = `/products?category=${encodeURIComponent(category)}`;
    return {
      title: c.title,
      description: c.description,
      alternates: { canonical: url },
      openGraph: { title: `${c.title} | Gandhi Brothers`, description: c.description, url },
    };
  }

  return {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    alternates: { canonical: '/products' },
    openGraph: {
      title: `${DEFAULT_SEO.title} | Gandhi Brothers`,
      description: DEFAULT_SEO.description,
      url: '/products',
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.category && CATEGORY_SEO[params.category] ? params.category : undefined;
  const copy = category ? CATEGORY_SEO[category] : DEFAULT_SEO;

  const breadcrumbItems = category
    ? [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/products' }, { label: copy.h1 }]
    : [{ label: 'Home', href: '/' }, { label: 'Shop' }];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.label,
      ...(b.href ? { item: `${SITE_URL}${b.href}` } : {}),
    })),
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.h1,
    description: copy.description,
    url: category ? `${SITE_URL}/products?category=${encodeURIComponent(category)}` : `${SITE_URL}/products`,
    isPartOf: { '@type': 'WebSite', name: 'Gandhi Brothers', url: SITE_URL },
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Breadcrumbs className="mb-6 px-2 sm:px-0" items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold">{copy.h1}</h1>
        <div className="terracotta-rule mx-0" />
        <p className="text-ink-400 max-w-2xl leading-relaxed">{copy.intro}</p>
      </div>

      <ProductFilters />

      <Suspense key={JSON.stringify(params)} fallback={<ProductGridSkeleton />}>
        <ProductGrid params={params} />
      </Suspense>
    </div>
  );
}

async function ProductGrid({ params }: { params: SearchParams }) {
  const groups = await searchGroupedProducts(params);

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm text-ink-400 mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  // ItemList structured data for the visible products (improves catalogue understanding).
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: groups.length,
    itemListElement: groups.slice(0, 30).map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/products/${g.slug}`,
      name: g.baseName,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <p className="text-sm text-ink-400 mb-4">
        Showing {groups.length} {groups.length === 1 ? 'product' : 'products'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {groups.map((g) => (
          <ProductGroupCard key={g.baseName} group={g} />
        ))}
      </div>
    </>
  );
}
