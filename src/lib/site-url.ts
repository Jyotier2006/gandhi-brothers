/**
 * Canonical, absolute site URL used for metadata, canonicals, sitemap, robots,
 * and JSON-LD.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — but ONLY if it's a real public URL. A `localhost`
 *      value (common when a dev value is accidentally copied into the hosting
 *      environment) is treated as unset, so production never emits localhost
 *      URLs in canonicals/sitemaps — which would be catastrophic for SEO.
 *   2. Fallback to the production host (apex redirects here, so www is canonical).
 */
const CANONICAL = "https://www.gandhibrothers.co.in";

function resolve(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && !/localhost|127\.0\.0\.1|0\.0\.0\.0/.test(raw)) {
    return raw.replace(/\/+$/, "");
  }
  return CANONICAL;
}

export const SITE_URL = resolve();
