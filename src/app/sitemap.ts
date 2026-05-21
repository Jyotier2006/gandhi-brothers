import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getAllArticles } from "@/lib/blog";
import { SITE_URL as BASE_URL } from "@/lib/site-url";

/** Static routes with their relative change priority. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "daily" },
  { path: "/heritage", priority: 0.6, changeFrequency: "yearly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/certifications", priority: 0.5, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/inquiry", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
  { path: "/shipping-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Product pages — gracefully degrades to [] if the catalogue is unavailable.
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    const seen = new Set<string>();
    productEntries = products
      .filter((p) => {
        if (seen.has(p.slug)) return false;
        seen.add(p.slug);
        return true;
      })
      .map((p) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        // Image sitemap entry — improves Google Images discovery for product photos.
        images: p.image ? [`${BASE_URL}${p.image}`] : undefined,
      }));
  } catch {
    productEntries = [];
  }

  // Blog articles (static content — always available).
  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...articleEntries];
}
