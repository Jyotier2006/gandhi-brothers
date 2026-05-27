"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { SignInCta } from "@/components/auth/signin-cta";

/**
 * Shown in place of the review form when the visitor can't review yet:
 *  - not signed in  → invite to sign in with Google
 *  - signed in but hasn't bought this product → explain verified-only reviews
 */
export function ReviewPrompt({
  signedIn,
  productName,
}: {
  signedIn: boolean;
  productName: string;
}) {
  const t = useTranslations("reviews");
  return (
    <div className="rounded-2xl border border-ink-50 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream">
        <ShieldCheck className="h-6 w-6 text-terracotta" />
      </div>
      <h3 className="font-sans text-lg font-bold text-ink">{t("verifiedOnlyTitle")}</h3>

      {signedIn ? (
        <p className="mx-auto mt-1 max-w-xs text-sm text-ink/60">
          {t("verifiedOnlyBody", { product: productName })}
        </p>
      ) : (
        <>
          <p className="mx-auto mt-1 mb-5 max-w-xs text-sm text-ink/60">
            {t("signInToReviewBody", { product: productName })}
          </p>
          <div className="flex justify-center">
            <SignInCta label={t("signInToReview")} />
          </div>
        </>
      )}
    </div>
  );
}
