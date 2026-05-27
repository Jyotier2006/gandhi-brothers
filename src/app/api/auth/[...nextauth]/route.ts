import { handlers } from "@/auth";

// Auth.js mounts all OAuth endpoints (sign-in, callback, session, sign-out)
// under /api/auth/* via this catch-all route.
export const { GET, POST } = handlers;
