'use client';

/**
 * Pincode + shipping calculator widget for checkout.
 *
 * Drop into your checkout page. Wire it up by passing your cart items and
 * a callback that fires when the shipping rate changes (so cart total updates).
 *
 * Usage:
 *   const [shipping, setShipping] = useState<{ rate: number; estimatedDays: number } | null>(null);
 *
 *   <PincodeCheck
 *     items={cartItems}
 *     pincode={pincode}
 *     onPincodeChange={setPincode}
 *     onQuoteChange={setShipping}
 *   />
 *
 * Pay button should be disabled until shipping !== null.
 */
import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type CartItem = { productId: string; quantity: number };

type Quote = {
  rate: number;
  estimatedDays: number;
  /** Weight-based packaging cost (₹), computed server-side. */
  packaging: number;
};

export function PincodeCheck({
  items,
  pincode,
  onPincodeChange,
  onQuoteChange,
}: {
  items: CartItem[];
  pincode: string;
  onPincodeChange: (p: string) => void;
  onQuoteChange: (quote: Quote | null) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ok' | 'unserviceable' | 'error'>('idle');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedRef = useRef<string>('');

  // Debounced auto-check when pincode is exactly 6 digits
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!/^\d{6}$/.test(pincode)) {
      setStatus('idle');
      setQuote(null);
      onQuoteChange(null);
      return;
    }

    // Avoid re-checking the same pincode
    if (pincode === lastCheckedRef.current && quote) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      checkPincode(pincode);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode, items.length]); // refire if cart changes too

  async function checkPincode(pin: string) {
    if (items.length === 0) return;
    setStatus('checking');
    setErrorMsg(null);
    lastCheckedRef.current = pin;

    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: pin, items }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Could not check delivery.');
        setQuote(null);
        onQuoteChange(null);
        return;
      }

      if (!data.serviceable) {
        setStatus('unserviceable');
        setQuote(null);
        onQuoteChange(null);
        return;
      }

      const newQuote = { rate: data.rate, estimatedDays: data.estimatedDays, packaging: data.packaging ?? 0 };
      setQuote(newQuote);
      setStatus('ok');
      onQuoteChange(newQuote);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
      setQuote(null);
      onQuoteChange(null);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink/80 ml-1">
        PIN code <span className="text-terracotta">*</span>
      </label>

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => onPincodeChange(e.target.value.replace(/\D/g, ''))}
          placeholder="6-digit pincode"
          className="flex h-14 w-full rounded-2xl border border-ink-100/60 bg-cream/30 px-4 pr-10 py-2 text-sm text-ink placeholder:text-ink-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-terracotta/30 focus-visible:bg-white focus-visible:border-terracotta/40 transition-colors"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === 'checking' && <Loader2 className="w-4 h-4 text-terracotta animate-spin" />}
          {status === 'ok' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
          {(status === 'unserviceable' || status === 'error') && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>

      {/* Status messages */}
      {status === 'ok' && quote && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Delivers in approximately <strong>{quote.estimatedDays} days</strong>
            {' '}for <strong>₹{quote.rate}</strong>
          </span>
        </div>
      )}

      {status === 'unserviceable' && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p>Sorry, we don&apos;t ship to this pincode yet.</p>
            <p className="text-xs mt-1">
              Please email{' '}
              <a href="mailto:support@gandhibrothers.co.in" className="underline">
                support@gandhibrothers.co.in
              </a>{' '}
              for alternatives.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && errorMsg && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
