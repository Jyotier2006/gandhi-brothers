import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only star display. Renders 5 stars with a fractional fill for `value`. */
export function StarRating({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={cn("relative inline-flex", className)}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      {/* Empty track */}
      <span className="flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} style={{ width: size, height: size }} className="text-mustard/30" />
        ))}
      </span>
      {/* Filled overlay clipped to pct */}
      <span className="absolute inset-0 flex overflow-hidden" style={{ width: `${pct}%` }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} style={{ width: size, height: size }} className="shrink-0 fill-mustard text-mustard" />
        ))}
      </span>
    </span>
  );
}
