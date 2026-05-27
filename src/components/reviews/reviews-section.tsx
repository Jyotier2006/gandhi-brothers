import { MessageSquareText, BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { StarRating } from "@/components/reviews/star-rating";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewPrompt } from "@/components/reviews/review-prompt";
import type { Review, ReviewSummary } from "@/lib/reviews";

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export async function ReviewsSection({
  productKey,
  productName,
  reviews,
  summary,
  signedIn,
  canReview,
  userName,
}: {
  productKey: string;
  productName: string;
  reviews: Review[];
  summary: ReviewSummary;
  /** Is a shopper signed in? */
  signedIn: boolean;
  /** Signed in AND has purchased this product — only then may they review. */
  canReview: boolean;
  /** Signed-in user's name, used to prefill the review form. */
  userName: string;
}) {
  const t = await getTranslations("reviews");
  return (
    <section id="reviews" className="mt-24 pt-16 border-t border-ink-100/50 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold font-sans text-ink">{t("title")}</h2>
          <div className="h-1 w-16 bg-mustard rounded-full mt-3" />
        </div>
        {summary.count > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold text-ink leading-none">{summary.average.toFixed(1)}</span>
            <div>
              <StarRating value={summary.average} size={18} />
              <p className="text-sm text-ink/50 mt-1">
                {t("count", { count: summary.count })}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Reviews list / empty state */}
        <div className="space-y-5">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-100 bg-cream/30 p-8 text-center">
              <MessageSquareText className="h-8 w-8 text-terracotta/60 mx-auto mb-3" />
              <p className="font-bold text-ink">{t("noneTitle")}</p>
              <p className="text-sm text-ink/60 mt-1">{t("noneBody", { product: productName })}</p>
            </div>
          ) : (
            reviews.map((r, i) => (
              <article key={i} className="rounded-2xl border border-ink-50 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <StarRating value={r.rating} size={15} />
                  <span className="text-xs text-ink/40">{formatDate(r.date)}</span>
                </div>
                {r.title && <p className="font-bold text-ink mt-3">{r.title}</p>}
                <p className="font-serif text-ink/75 leading-relaxed mt-1">{r.body}</p>
                <div className="mt-3 flex items-center gap-2">
                  <p className="text-sm font-semibold text-terracotta">— {r.name}</p>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700 ring-1 ring-green-200">
                      <BadgeCheck className="h-3 w-3" />
                      {t("verifiedPurchase")}
                    </span>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {/* Submission form — verified buyers only; everyone else gets a prompt */}
        {canReview ? (
          <ReviewForm productKey={productKey} productName={productName} defaultName={userName} />
        ) : (
          <ReviewPrompt signedIn={signedIn} productName={productName} />
        )}
      </div>
    </section>
  );
}
