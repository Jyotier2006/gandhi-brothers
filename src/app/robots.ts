import type { MetadataRoute } from "next";
import { SITE_URL as BASE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep transactional / personal flows out of the index.
        disallow: ["/cart", "/checkout", "/wishlist", "/order-success", "/order-failed", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
