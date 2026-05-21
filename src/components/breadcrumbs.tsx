import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

/** Accessible breadcrumb trail. The last crumb is rendered as the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="hover:text-terracotta transition-colors font-medium"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="font-semibold text-ink/80 line-clamp-1 max-w-[60vw] sm:max-w-xs"
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink/30" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
