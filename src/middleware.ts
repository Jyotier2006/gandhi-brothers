import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on everything EXCEPT: API routes (incl. /api/auth), Next internals,
  // and any path containing a dot (static files, sitemap.xml, robots.txt,
  // verification HTML, images). Those must not be locale-redirected.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
