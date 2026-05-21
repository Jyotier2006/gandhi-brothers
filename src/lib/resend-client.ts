import { Resend } from "resend";

/**
 * Lazily-created Resend client.
 *
 * IMPORTANT: never instantiate `new Resend(...)` at module scope. The Resend
 * constructor throws when RESEND_API_KEY is absent, and Next collects page data
 * for every route at build time — so a top-level instantiation crashes the
 * production build on any host where the key isn't present at build. This getter
 * defers construction to request time and returns null when unconfigured, so the
 * build always succeeds and email simply no-ops if the key is missing.
 */
let client: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}
