/**
 * Products listing page — async, reads from Sheet via searchProducts().
 * Replace src/app/products/page.tsx with this file.
 */
import { Suspense } from 'react';
import { searchProducts } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
  const products = await searchProducts(params);

  if (!products || products.length === 0) {
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
        Showing {products.length} {products.length === 1 ? 'product' : 'products'}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
