/**
 * Products listing page — groups SKUs by base product name.
 */
import { Suspense } from 'react';
import { searchGroupedProducts } from '@/lib/products';
import { ProductGroupCard } from '@/components/product-group-card';
import { ProductGridSkeleton } from '@/components/product-card-skeleton';
import { ProductFilters } from '@/components/product-filters';

export const revalidate = 60;

type SearchParams = {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold">Shop</h1>
        <div className="terracotta-rule mx-0" />
        <p className="text-ink-400">All Gandhi Brothers formulations.</p>
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

  return (
    <>
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
