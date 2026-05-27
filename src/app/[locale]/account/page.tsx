import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, ShoppingBag, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { getOrdersByEmail } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import { effectivePrice, formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignInCta } from "@/components/auth/signin-cta";
import { BuyAgainButton } from "@/components/account/buy-again-button";
import type { CartItem, OrderRecord, Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Your Gandhi Brothers order history.",
  // A private, per-user page — keep it out of search indexes.
  robots: { index: false, follow: false },
  alternates: { canonical: "/account" },
};

// Reads the session, so it must render per-request.
export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Resolve an order's free-text items back to current catalogue products,
 * producing cart-ready line items at today's price/stock. Items that are sold
 * out or no longer in the catalogue are counted as unavailable.
 */
function buildReorder(
  order: OrderRecord,
  byName: Map<string, Product>
): { items: CartItem[]; unavailable: number } {
  const items: CartItem[] = [];
  let unavailable = 0;
  for (const it of order.items) {
    const p = byName.get((it.name || "").trim().toLowerCase());
    if (p && p.stock > 0) {
      items.push({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        price: effectivePrice(p.price, p.discount_price),
        image: p.image,
        quantity: Math.min(it.quantity || 1, p.stock),
        stock: p.stock,
      });
    } else {
      unavailable++;
    }
  }
  return { items, unavailable };
}

export default async function AccountPage() {
  const session = await auth();
  const email = session?.user?.email;

  // ── Signed out ──────────────────────────────────────────────────────────
  if (!email) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-ink-50 bg-cream shadow-inner">
          <ShoppingBag className="h-11 w-11 text-ink-300" />
        </div>
        <h1 className="mb-3 font-sans text-3xl font-bold text-ink">Your orders</h1>
        <p className="mb-8 font-serif text-lg text-ink/70">
          Sign in with Google to see your order history and tracking.
        </p>
        <SignInCta callbackUrl="/account" />
      </div>
    );
  }

  const orders = await getOrdersByEmail(email);
  // Catalogue lookup (by exact product name) to resolve "Buy again" line items.
  const products = await getAllProducts().catch(() => []);
  const byName = new Map(products.map((p) => [p.name.trim().toLowerCase(), p] as const));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-bold text-ink md:text-4xl">My Orders</h1>
        <div className="terracotta-rule mx-0" />
        <p className="text-ink-400">
          Signed in as <span className="font-semibold text-ink">{email}</span>
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-100 bg-cream/30 p-10 text-center">
          <Package className="mx-auto mb-3 h-9 w-9 text-terracotta/60" />
          <p className="font-bold text-ink">No orders yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink/60">
            When you place an order it’ll appear here with its status and tracking.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/products">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const reorder = buildReorder(order, byName);
            return (
            <article
              key={order.id}
              className="rounded-2xl border border-ink-50 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-2 border-b border-ink-50 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-terracotta">
                    Order
                  </p>
                  <p className="font-mono text-sm font-medium text-ink">{order.id}</p>
                  <p className="mt-0.5 text-xs text-ink/50">{formatDate(order.createdAt)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-terracotta">
                    Total
                  </p>
                  <p className="text-lg font-bold text-mustard">{formatINR(order.total)}</p>
                </div>
              </div>

              {/* Items */}
              <ul className="mt-4 space-y-1.5">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-ink/75">
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Status / tracking + reorder */}
              <div className="mt-4 flex flex-col gap-3 border-t border-ink-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {order.awbCode ? (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                        <Truck className="h-4 w-4 text-terracotta" />
                        {order.courierName || "Shipped"}
                      </span>
                      <span className="font-mono text-ink/60">AWB {order.awbCode}</span>
                      <a
                        href={`https://shiprocket.co/tracking/${order.awbCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-mustard hover:underline"
                      >
                        Track package →
                      </a>
                    </div>
                  ) : (
                    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/70">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {order.paidAt ? "Paid — packing your order" : "Order received"}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <BuyAgainButton items={reorder.items} unavailable={reorder.unavailable} />
                </div>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
