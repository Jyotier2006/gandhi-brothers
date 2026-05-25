"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart-store";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PincodeCheck } from "@/components/pincode-check";
import type { CheckoutAddress } from "@/lib/types";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Puducherry", "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep"
];

const INITIAL_ADDRESS: CheckoutAddress = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "Gujarat",
  pincode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutAddress>(INITIAL_ADDRESS);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddress, string>>>({});
  const [shipping, setShipping] = useState<{ rate: number; estimatedDays: number } | null>(null);

  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  // Shown after a successful payment while we verify + create the order server-side.
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gandhi-checkout");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {
        // ignore malformed cache
      }
    }
    setHydrated(true);
  }, []);

  const validateField = (name: keyof CheckoutAddress, value: string): string | undefined => {
    switch (name) {
      case "name":
        return value.trim() ? undefined : "Full name is required.";
      case "email":
        return /^\S+@\S+\.\S+$/.test(value) ? undefined : "Enter a valid email address.";
      case "phone":
        return /^[6-9]\d{9}$/.test(value) ? undefined : "Enter a valid 10-digit Indian mobile number.";
      case "address":
        return value.trim() ? undefined : "Address is required.";
      case "city":
        return value.trim() ? undefined : "City is required.";
      case "state":
        return value.trim() ? undefined : "State is required.";
      case "pincode":
        return /^\d{6}$/.test(value) ? undefined : "Enter a valid 6-digit PIN code.";
      default:
        return undefined;
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    if (name === "pincode" || name === "phone") {
      value = value.replace(/\D/g, "");
    }
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    localStorage.setItem("gandhi-checkout", JSON.stringify(newForm));
    // Clear the field's error as the user corrects it.
    if (errors[name as keyof CheckoutAddress]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof CheckoutAddress;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name]) }));
  };

  const validateAll = (): Partial<Record<keyof CheckoutAddress, string>> => {
    const next: Partial<Record<keyof CheckoutAddress, string>> = {};
    (Object.keys(form) as (keyof CheckoutAddress)[]).forEach((key) => {
      const msg = validateField(key, form[key]);
      if (msg) next[key] = msg;
    });
    return next;
  };

  const placeOrder = async () => {
    const found = validateAll();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      toast.error(Object.values(found)[0]);
      // Bring the first invalid field into view.
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});

    setSubmitting(true);
    const loadingId = toast.loading("Starting secure checkout…");
    const cartLines = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));

    try {
      // 1. Create the order server-side. The server is the single source of
      //    truth for pricing + shipping — we never trust client-sent totals.
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartLines, pincode: form.pincode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start checkout. Please try again.");

      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Payment is still loading — please try again in a moment.");
      }

      const serverShipping = data.breakdown?.shipping ?? shippingCost;
      toast.dismiss(loadingId);

      // 2. Open the Razorpay checkout widget against that order.
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Gandhi Brothers",
        description: "Ayurvedic order",
        image: "/logo.png",
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { address: `${form.address}, ${form.city}, ${form.state} ${form.pincode}` },
        theme: { color: "#A69279" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Payment succeeded on Razorpay's side — verify the signature
          //    server-side, which also decrements stock, ships, and emails.
          setConfirming(true);
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cartLines,
                address: form,
                shippingCost: serverShipping,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "We could not confirm your payment automatically.");
            }
            clearCart();
            localStorage.removeItem("gandhi-checkout");
            router.push(`/order-success?orderId=${encodeURIComponent(verifyData.orderId)}`);
          } catch (err) {
            const reason = err instanceof Error ? err.message : "We could not confirm your payment.";
            router.push(`/order-failed?reason=${encodeURIComponent(reason)}`);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            toast("Payment cancelled — your cart is saved.");
          },
        },
      });

      rzp.on("payment.failed", (resp: { error?: { description?: string } }) => {
        const reason = resp?.error?.description || "Your payment was declined. Please try again.";
        router.push(`/order-failed?reason=${encodeURIComponent(reason)}`);
      });

      rzp.open();
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-terracotta relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
          <ShieldCheck className="h-10 w-10 text-terracotta opacity-50" />
          <p className="font-semibold tracking-widest text-[10px] uppercase">Initiating secure checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-lg mx-auto text-center px-4">
        <div className="mb-6 h-28 w-28 rounded-full bg-cream shadow-inner flex items-center justify-center border border-ink-50">
          <ShoppingBag className="h-12 w-12 text-ink-300" />
        </div>
        <h1 className="text-4xl font-sans font-bold text-ink mb-4">Your cart is empty</h1>
        <p className="font-serif text-lg text-ink/70 mb-10 max-w-sm">
          You need items in your cart to proceed with the checkout process.
        </p>
        <Link href="/products">
          <Button size="lg" className="h-14 px-10 rounded-full shadow-lg">Browse products</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingCost = shipping?.rate ?? 0;
  const total = subtotal + shippingCost;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="relative min-h-screen pb-24 bg-cream/30">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-cream to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-ink tracking-tight pb-2">Checkout</h1>
            <div className="h-1.5 w-16 bg-gradient-to-r from-terracotta to-mustard rounded-full mx-auto lg:mx-0 mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ── LEFT: FORM ────────────────────────────────────────────────── */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 sm:p-10 shadow-2xl shadow-ink/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-bold font-sans text-ink">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="name" className="text-ink/80 font-semibold ml-1">Full name</Label>
                    <Input
                      id="name" name="name"
                      value={form.name} onChange={handleFormChange} onBlur={handleFieldBlur}
                      placeholder="e.g. Rahul Patel"
                      disabled={submitting}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={cn("h-14 rounded-2xl bg-cream/30 border-ink-100/60 focus-visible:ring-terracotta/30 focus-visible:bg-white transition-colors", errors.name && "border-red-400 focus-visible:ring-red-300")}
                    />
                    {errors.name && <p id="name-error" className="text-sm text-red-500 ml-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-ink/80 font-semibold ml-1">Email address</Label>
                    <Input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleFormChange} onBlur={handleFieldBlur}
                      placeholder="name@example.com"
                      disabled={submitting}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={cn("h-14 rounded-2xl bg-cream/30 border-ink-100/60 focus-visible:ring-terracotta/30 focus-visible:bg-white transition-colors", errors.email && "border-red-400 focus-visible:ring-red-300")}
                    />
                    {errors.email && <p id="email-error" className="text-sm text-red-500 ml-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-ink/80 font-semibold ml-1">Phone number</Label>
                    <Input
                      id="phone" name="phone" type="tel" maxLength={10}
                      value={form.phone} onChange={handleFormChange} onBlur={handleFieldBlur}
                      placeholder="10-digit mobile"
                      disabled={submitting}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={cn("h-14 rounded-2xl bg-cream/30 border-ink-100/60 focus-visible:ring-terracotta/30 focus-visible:bg-white transition-colors", errors.phone && "border-red-400 focus-visible:ring-red-300")}
                    />
                    {errors.phone && <p id="phone-error" className="text-sm text-red-500 ml-1">{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-2 pt-2">
                    <Label htmlFor="address" className="text-ink/80 font-semibold ml-1">Complete address</Label>
                    <Input
                      id="address" name="address"
                      value={form.address} onChange={handleFormChange} onBlur={handleFieldBlur}
                      placeholder="House no, street, locality"
                      disabled={submitting}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "address-error" : undefined}
                      className={cn("h-14 rounded-2xl bg-cream/30 border-ink-100/60 focus-visible:ring-terracotta/30 focus-visible:bg-white transition-colors", errors.address && "border-red-400 focus-visible:ring-red-300")}
                    />
                    {errors.address && <p id="address-error" className="text-sm text-red-500 ml-1">{errors.address}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-ink/80 font-semibold ml-1">City</Label>
                    <Input
                      id="city" name="city"
                      value={form.city} onChange={handleFormChange} onBlur={handleFieldBlur}
                      placeholder="e.g. Junagadh"
                      disabled={submitting}
                      aria-invalid={!!errors.city}
                      aria-describedby={errors.city ? "city-error" : undefined}
                      className={cn("h-14 rounded-2xl bg-cream/30 border-ink-100/60 focus-visible:ring-terracotta/30 focus-visible:bg-white transition-colors", errors.city && "border-red-400 focus-visible:ring-red-300")}
                    />
                    {errors.city && <p id="city-error" className="text-sm text-red-500 ml-1">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-ink/80 font-semibold ml-1">State</Label>
                    <div className="relative">
                      <select
                        id="state" name="state"
                        value={form.state} onChange={handleFormChange} disabled={submitting}
                        className="flex h-14 w-full appearance-none rounded-2xl border border-ink-100/60 bg-cream/30 px-4 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-terracotta/30 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                        <svg className="h-4 w-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <PincodeCheck
                    items={items.map((i) => ({ productId: i.productId, quantity: i.quantity }))}
                    pincode={form.pincode}
                    onPincodeChange={(p) => {
                      const newForm = { ...form, pincode: p };
                      setForm(newForm);
                      localStorage.setItem("gandhi-checkout", JSON.stringify(newForm));
                    }}
                    onQuoteChange={setShipping}
                  />
                </div>
              </div>
            </div>

            {/* ── RIGHT: SUMMARY ──────────────────────────────────────────────── */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 bg-white border border-white rounded-[2rem] shadow-2xl shadow-ink/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-ink/5 text-ink flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <h2 className="text-2xl font-bold font-sans text-ink">Payment</h2>
                  </div>

                  <div className="max-h-64 overflow-y-auto mb-6 space-y-4 pr-3 scrollbar-thin scrollbar-thumb-ink-200">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-4 group">
                        <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-cream to-[#F7EFE8] overflow-hidden shrink-0 border border-ink-50">
                          <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain p-1 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <span className="font-bold text-ink line-clamp-1">{item.name}</span>
                          <span className="text-ink-400 font-medium text-xs mt-0.5">Qty {item.quantity} × {formatINR(item.price)}</span>
                        </div>
                        <div className="text-sm font-bold text-ink flex items-center justify-end">
                          {formatINR(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-ink-200 my-6" />

                  <div className="space-y-3 text-[15px] font-medium text-ink/80 mb-6 border-b border-ink-100/50 pb-6">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span className="font-bold text-ink">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      {shipping !== null ? (
                        <span className="font-bold text-ink">{formatINR(shippingCost)}</span>
                      ) : (
                        <span className="text-ink/40 text-sm italic">Enter pincode</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-8">
                    <span className="block text-sm text-ink/50 font-bold uppercase tracking-wider mb-1">To Pay</span>
                    {shipping !== null ? (
                      <span className="text-3xl font-extrabold text-terracotta tracking-tight">{formatINR(total)}</span>
                    ) : (
                      <span className="text-sm font-semibold text-ink/40 italic">Enter pincode above</span>
                    )}
                  </div>

                  <Button
                    size="lg"
                    onClick={placeOrder}
                    className="w-full h-16 rounded-2xl text-lg shadow-xl shadow-terracotta/20 bg-ink hover:bg-terracotta transition-all duration-300 relative overflow-hidden"
                    disabled={submitting || !shipping}
                  >
                    {submitting ? (
                      <span className="animate-pulse">Loading gateway…</span>
                    ) : !shipping ? (
                      <>Enter pincode to continue</>
                    ) : (
                      <>Pay {formatINR(total)} securely</>
                    )}
                  </Button>
                </div>

                {/* Security footer embedded inside the card */}
                <div className="bg-ink-50/50 py-4 px-6 border-t border-ink-100">
                  <div className="text-[11px] text-ink-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    Encrypted via Razorpay
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center border border-ink-50">
            <div className="mx-auto h-16 w-16 mb-6 rounded-full border-4 border-cream border-t-terracotta animate-spin" />
            <h2 className="text-2xl font-bold font-sans text-ink mb-2">Confirming your order</h2>
            <p className="text-ink-400 leading-relaxed">
              Payment received — please wait while we confirm it. Don&apos;t close this window.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
