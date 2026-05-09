import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-sm bg-white border border-ink-100 p-3 shadow-sm h-full">
      <Skeleton className="aspect-square w-full rounded-sm shrink-0" />
      <div className="flex flex-col gap-2 px-1 py-1 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/4 mt-auto" />
        <Skeleton className="h-9 w-full mt-2 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
