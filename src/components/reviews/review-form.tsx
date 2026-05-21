"use client";

import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ReviewForm({ productKey, productName }: { productKey: string; productName: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) return toast.error("Please select a star rating.");
    if (!name.trim()) return toast.error("Please add your name.");
    if (body.trim().length < 10) return toast.error("Please write at least a sentence.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productKey, name, rating, title, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit review.");
      setDone(true);
      toast.success("Thank you! Your review will appear once approved.");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 flex items-start gap-3">
        <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
        <div>
          <p className="font-bold text-ink">Thank you for your review</p>
          <p className="text-sm text-ink/70 mt-1">
            We read every submission. Once it&apos;s approved, it&apos;ll appear here for other customers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-50 bg-white p-6 space-y-5 shadow-sm">
      <div>
        <h3 className="font-sans font-bold text-lg text-ink">Write a review</h3>
        <p className="text-sm text-ink/50 mt-0.5">Share your experience with {productName}.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-ink/80 font-semibold">Your rating</Label>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-1 rounded transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hover || rating) >= n ? "fill-mustard text-mustard" : "text-ink/25"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rv-name" className="text-ink/80 font-semibold">Name</Label>
          <Input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" disabled={submitting} maxLength={60} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rv-title" className="text-ink/80 font-semibold">Title <span className="text-ink/40 font-normal">(optional)</span></Label>
          <Input id="rv-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sums up your review" disabled={submitting} maxLength={80} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rv-body" className="text-ink/80 font-semibold">Your review</Label>
        <textarea
          id="rv-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you think? Please avoid medical claims — just your honest experience."
          disabled={submitting}
          rows={4}
          maxLength={1000}
          className="flex w-full rounded-2xl border border-ink-100/60 bg-cream/30 px-4 py-3 text-sm ring-offset-white placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-terracotta/30 focus-visible:bg-white disabled:opacity-50 transition-colors resize-y"
        />
      </div>

      <Button type="submit" disabled={submitting} size="lg" className="rounded-xl">
        {submitting ? "Submitting…" : "Submit review"}
      </Button>
      <p className="text-xs text-ink/40">Reviews are moderated before they appear, to keep them genuine.</p>
    </form>
  );
}
