/**
 * Extra checkout charges, kept in ONE place so the quote endpoint, order
 * creation, and payment verification all compute identical numbers.
 *
 *  - Packaging: ₹30 per kg, rounded UP to the next whole kg (minimum one kg).
 *      < 1 kg → ₹30, 1–2 kg → ₹60, 2–3 kg → ₹90, …
 *  - Website charge: 5% of the product subtotal (goods only), rounded to ₹.
 *
 * "Handling" is the customer-facing sum of the two (shown as one line).
 */

export const PACKAGING_PER_KG = 30;
export const WEBSITE_FEE_RATE = 0.05;

/** ₹30 per kg, rounded up; never less than one kg's worth. */
export function packagingCost(weightKg: number): number {
  const kg = Math.max(1, Math.ceil(weightKg || 0));
  return kg * PACKAGING_PER_KG;
}

/** 5% of the product subtotal, rounded to the nearest rupee. */
export function websiteFee(subtotal: number): number {
  return Math.round((subtotal || 0) * WEBSITE_FEE_RATE);
}

/** Combined "Handling & packaging" charge = packaging + website fee. */
export function handlingCharge(subtotal: number, weightKg: number): number {
  return packagingCost(weightKg) + websiteFee(subtotal);
}
