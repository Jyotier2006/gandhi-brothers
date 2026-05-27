/**
 * Has a given customer (by email) actually bought a given product?
 * Powers verified-buyer reviews — only real purchasers may review.
 *
 * Orders store their items as free text (the product *name*), so we match an
 * ordered item to a product by name: we collect every catalogue name that
 * shares the product's review key (all pack-size variants), then check the
 * customer's orders for any of those names. Falls back to a slugified compare
 * for products that may have been renamed/discontinued.
 */
import { getOrdersByEmail } from "./orders";
import { getAllProducts } from "./products";
import { stripPackSize } from "./utils";
import { toReviewKey } from "./reviews";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function hasPurchasedProduct(
  email: string | null | undefined,
  productKey: string
): Promise<boolean> {
  if (!email || !productKey) return false;

  const [orders, products] = await Promise.all([
    getOrdersByEmail(email),
    getAllProducts().catch(() => []),
  ]);
  if (orders.length === 0) return false;

  // All catalogue names (full + base) that belong to this review key.
  const names = new Set<string>();
  for (const p of products) {
    if (toReviewKey(p.slug) === productKey) {
      names.add(p.name.trim().toLowerCase());
      names.add(stripPackSize(p.name).trim().toLowerCase());
    }
  }

  for (const o of orders) {
    for (const it of o.items) {
      const full = (it.name ?? "").trim().toLowerCase();
      const base = stripPackSize(it.name ?? "").trim().toLowerCase();
      if (names.has(full) || names.has(base)) return true;
      if (slugify(base) === productKey) return true;
    }
  }
  return false;
}
