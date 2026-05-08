/**
 * Auto-derives shipping weight (in grams) from a product's category + pack size.
 *
 * No Sheet column needed — the loader calls this for every product.
 *
 * Rules (includes ~50g packaging buffer):
 *   Churna  (powder pouch):     100g→150, 200g→280, 500g→600, 1kg→1100
 *   Capsule (bottle):           30caps→80, 60caps→120, 90caps→170
 *   Arishta (glass, liquid):    225ml→320, 450ml→550, 680ml→800
 *   Taila   (oil bottle):       50ml→130, 100ml→200, 200ml→350
 *   Vati/Tablet:                60tabs→80, 120tabs→140
 *   Fallback: extract numeric part of pack size + 50g buffer.
 */

const RULES: Record<string, Record<string, number>> = {
  Churna:   { '100g': 150, '200g': 280, '500g': 600, '1kg': 1100 },
  Capsule:  { '30caps': 80, '60caps': 120, '90caps': 170 },
  Arishta:  { '225ml': 320, '450ml': 550, '680ml': 800 },
  Taila:    { '50ml': 130, '100ml': 200, '200ml': 350 },
  Vati:     { '60tabs': 80, '120tabs': 140 },
  Tablet:   { '60tabs': 80, '120tabs': 140 },
};

/**
 * Normalise a pack-size string to lookup key.
 *   "100g"   → "100g"
 *   "100 g"  → "100g"
 *   "60 caps"→ "60caps"
 *   "60 capsules" → "60caps"
 *   "1 kg" → "1kg"
 *   "450 ml" → "450ml"
 */
function normalisePackSize(raw: string): string {
  const s = String(raw || '').toLowerCase().replace(/\s+/g, '');
  // unify all "capsule"/"caps"/"cap" → "caps"
  return s
    .replace(/capsules?/g, 'caps')
    .replace(/tablets?|tabs?/g, 'tabs');
}

/**
 * Fallback: extract numeric weight from pack size text.
 * Returns weight in grams + 50g packaging buffer.
 */
function fallbackWeight(packSize: string): number {
  const s = packSize.toLowerCase();
  // Match patterns like "100g", "1.5kg", "450ml", "100ml"
  const gMatch = s.match(/(\d+(?:\.\d+)?)\s*g(?!\w)/);
  if (gMatch) return Math.ceil(parseFloat(gMatch[1])) + 50;

  const kgMatch = s.match(/(\d+(?:\.\d+)?)\s*kg/);
  if (kgMatch) return Math.ceil(parseFloat(kgMatch[1]) * 1000) + 80;

  const mlMatch = s.match(/(\d+(?:\.\d+)?)\s*ml/);
  if (mlMatch) {
    // For liquids, weight ≈ volume + ~25% for glass bottle + 50g buffer
    return Math.ceil(parseFloat(mlMatch[1]) * 1.25) + 50;
  }

  // Capsules / tablets without explicit weight — assume ~1g per unit + 60g bottle
  const capsMatch = s.match(/(\d+)\s*(?:caps?|tabs?|capsules?|tablets?)/);
  if (capsMatch) return parseInt(capsMatch[1], 10) + 60;

  // Last-resort default
  return 200;
}

/**
 * Derive shipping weight in grams from category + pack size.
 * Both inputs come from the Sheet's Products tab.
 */
export function deriveWeightGrams(category: string, packSize: string): number {
  if (!packSize) return 200;

  const cat = String(category || '').trim();
  const key = normalisePackSize(packSize);

  // Look up exact rule
  const catRules = RULES[cat];
  if (catRules && catRules[key] !== undefined) {
    return catRules[key];
  }

  // Fallback: parse numerical weight/volume from text
  return fallbackWeight(packSize);
}
