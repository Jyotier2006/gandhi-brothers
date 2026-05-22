import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind Class Merger ──────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Currency Formatting ────────────────────────────────────────────────────
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Pricing Logic ──────────────────────────────────────────────────────────
export function effectivePrice(price: number, discount: number | null): number {
  if (discount !== null && discount < price) {
    return discount;
  }
  return price;
}

export function calculateDiscount(price: number, discount: number | null): number {
  if (discount === null || discount >= price) return 0;
  return Math.round(((price - discount) / price) * 100);
}

// ── Product naming ──────────────────────────────────────────────────────────
/**
 * Strip the pack-size suffix from a product name so all pack-size variants
 * collapse to one base name, e.g. "Ashwagandha Churna (200g)" → "Ashwagandha Churna".
 * Shared by the catalogue grouping and the sales tally so they key off the
 * exact same base name.
 */
export function stripPackSize(name: string): string {
  return name
    .replace(/\s*\([\d.]+\s*(?:g|gm|kg|ml|l|tabs|capsules|cap)\)$/i, "")
    .trim();
}

// NOTE: calculateDelivery() has been REMOVED.
// Shipping is now fetched live from Shiprocket via /api/shipping/quote
// based on customer's pincode and cart weight.
