/**
 * Auth.js (NextAuth v5) configuration — Google sign-in only.
 *
 * Sessions are JWT-based (no database adapter), which fits the Sheets-backed
 * backend: we just need to know *who* the shopper is, not persist a user table.
 *
 * Reads these env vars (set in .env.local and Vercel):
 *   AUTH_SECRET         — random secret (npx auth secret)
 *   AUTH_GOOGLE_ID      — Google OAuth Client ID
 *   AUTH_GOOGLE_SECRET  — Google OAuth Client Secret
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  // Trust the deploy host (custom domain + apex→www) so callbacks resolve.
  trustHost: true,
});
