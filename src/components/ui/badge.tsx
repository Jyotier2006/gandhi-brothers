import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-terracotta text-white",
        secondary:
          "border-transparent bg-cream text-ink",
        success:
          "border-transparent bg-green-100 text-green-800",
        warning:
          "border-transparent bg-mustard-50 text-mustard-700",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        outline:
          "border border-ink-200 text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
