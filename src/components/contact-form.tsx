'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REASONS = [
  'Product question',
  'Order / shipping issue',
  'Regulatory / certificate request',
  'Practitioner enquiry',
  'Press / media',
  'Other',
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  reason: '',
  message: '',
};

export function ContactForm() {
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function validate(): string | null {
    if (!data.name.trim()) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      return 'Please enter a valid email address.';
    // Phone is optional, but if provided must be valid
    if (data.phone.trim() && !/^[6-9]\d{9}$/.test(data.phone.replace(/\s+/g, '')))
      return 'Please enter a valid 10-digit Indian mobile number.';
    if (!data.reason) return 'Please select a reason for contacting us.';
    if (!data.message.trim() || data.message.trim().length < 10)
      return 'Please enter a message of at least 10 characters.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed.');
      setSubmitted(true);
      setData(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-14 h-14 text-terracotta mx-auto mb-4" />
        <h3
          className="text-xl font-semibold text-ink mb-2"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Thank you for reaching out
        </h3>
        <p className="text-ink-400 max-w-md mx-auto leading-relaxed mb-5">
          We&rsquo;ve received your message and will respond within 1 business
          day at the email you provided.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Your Name" required>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            className="form-input"
            autoComplete="name"
          />
        </Field>

        <Field label="Email Address" required>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            className="form-input"
            autoComplete="email"
          />
        </Field>

        <Field label="Phone (Optional)">
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="form-input"
            placeholder="10-digit mobile"
            autoComplete="tel"
          />
        </Field>

        <Field label="Reason for contact" required>
          <select
            value={data.reason}
            onChange={(e) => update('reason', e.target.value)}
            className="form-input"
          >
            <option value="">Select a reason</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Your Message" required>
        <textarea
          value={data.message}
          onChange={(e) => update('message', e.target.value)}
          className="form-input min-h-[140px] resize-y"
          placeholder="How can we help?"
        />
      </Field>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={submitting} size="lg" className="min-w-[180px]">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending&hellip;
            </>
          ) : (
            'Send message'
          )}
        </Button>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5ddd2;
          border-radius: 8px;
          background: #fbf8f2;
          color: #6b4a35;
          font-size: 14px;
          transition: border-color 0.2s, background 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #a57051;
          background: #ffffff;
        }
        .form-input::placeholder {
          color: #b0a395;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      {children}
    </div>
  );
}
