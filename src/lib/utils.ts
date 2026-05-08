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

// NOTE: calculateDelivery() has been REMOVED.
// Shipping is now fetched live from Shiprocket via /api/shipping/quote
// based on customer's pincode and cart weight.
