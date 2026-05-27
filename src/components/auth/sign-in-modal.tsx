"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { X, Loader2 } from "lucide-react";
import { useAuthGate } from "@/lib/store/auth-gate-store";
import { GoogleMark } from "@/components/auth/google-mark";

/**
 * Popup shown when a signed-out shopper tries to add to cart / buy now.
 * Triggers Google OAuth; on return, PendingCartReplay completes the action.
 * Mounted once in the root layout.
 */
export function SignInModal() {
  const { open, message, closeGate } = useAuthGate();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleGoogle = async () => {
    setLoading(true);
    // Return to the current page after auth so the pending action can replay.
    await signIn("google", { callbackUrl: window.location.href });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={closeGate} />

      <div className="relative w-full max-w-sm rounded-3xl border border-ink-50 bg-white p-8 text-center shadow-2xl">
        <button
          onClick={closeGate}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-ink-300 transition-colors hover:bg-cream hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cream shadow-inner">
          <GoogleMark />
        </div>

        <h2 className="mb-2 font-sans text-2xl font-bold text-ink">Sign in to continue</h2>
        <p className="mb-7 leading-relaxed text-ink-400">{message}</p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-ink-100 bg-white px-5 py-3 font-semibold text-ink shadow-sm transition-all duration-200 hover:border-terracotta/40 hover:bg-cream/50 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleMark />}
          {loading ? "Redirecting…" : "Continue with Google"}
        </button>

        <p className="mt-5 text-xs leading-relaxed text-ink/40">
          We use your Google account only to identify your orders. No spam, ever.
        </p>
      </div>
    </div>
  );
}
