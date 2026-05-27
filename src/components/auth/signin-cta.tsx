"use client";

import { signIn } from "next-auth/react";
import { GoogleMark } from "@/components/auth/google-mark";

/** Standalone "Continue with Google" button (sign-in pages, review prompts). */
export function SignInCta({
  label = "Continue with Google",
  callbackUrl,
  className,
}: {
  label?: string;
  callbackUrl?: string;
  className?: string;
}) {
  return (
    <button
      onClick={() => signIn("google", callbackUrl ? { callbackUrl } : undefined)}
      className={
        className ??
        "inline-flex items-center justify-center gap-3 rounded-xl border border-ink-100 bg-white px-5 py-3 font-semibold text-ink shadow-sm transition-all duration-200 hover:border-terracotta/40 hover:bg-cream/50"
      }
    >
      <GoogleMark />
      {label}
    </button>
  );
}
