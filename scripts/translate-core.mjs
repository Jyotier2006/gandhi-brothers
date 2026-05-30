/**
 * Shared translation engine for the i18n scripts.
 *
 * Provider selection:
 *   - If GOOGLE_TRANSLATE_API_KEY is set → Google Cloud Translation v2 (best
 *     Hindi/Gujarati quality, 500k chars/month free on a billing-enabled project).
 *   - Otherwise → MyMemory free API (no key; low daily quota, weaker quality).
 *
 * Both paths share a domain GLOSSARY (Ayurvedic/brand terms) and protect ICU
 * {placeholders} from being mangled.
 */
const EMAIL = process.env.MYMEMORY_EMAIL || "";
const GOOGLE_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || "";

export const usingGoogle = !!GOOGLE_KEY;

/** Domain terms machine translation gets wrong — always use these (exact match). */
export const GLOSSARY = {
  Churna: { hi: "चूर्ण", gu: "ચૂર્ણ" },
  Churnas: { hi: "चूर्ण", gu: "ચૂર્ણ" },
  Taila: { hi: "तैल", gu: "તૈલ" },
  Tailas: { hi: "तैल", gu: "તૈલ" },
  Ayurveda: { hi: "आयुर्वेद", gu: "આયુર્વેદ" },
  Ayurvedic: { hi: "आयुर्वेदिक", gu: "આયુર્વેદિક" },
  Junagadh: { hi: "जूनागढ़", gu: "જૂનાગઢ" },
  Category: { hi: "श्रेणी", gu: "શ્રેણી" },
  Apply: { hi: "लागू करें", gu: "લાગુ કરો" },
  "Ayurvedic Churnas": { hi: "आयुर्वेदिक चूर्ण", gu: "આયુર્વેદિક ચૂર્ણ" },
  "Ayurvedic Tailas": { hi: "आयुर्वेदिक तैल", gu: "આયુર્વેદિક તૈલ" },
};

export function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

/** Protect ICU placeholders like {name} so the API can't translate them. */
function protect(text) {
  const tokens = [];
  const masked = text.replace(/\{[^}]+\}/g, (m) => {
    tokens.push(m);
    return `XPLH${tokens.length - 1}HPLX`;
  });
  return { masked, tokens };
}
function restore(text, tokens) {
  return text.replace(/XPLH(\d+)HPLX/g, (_, i) => tokens[Number(i)] ?? "");
}

async function viaGoogle(text, target) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "en", target, format: "text" }),
    }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google HTTP ${res.status}: ${body.slice(0, 140)}`);
  }
  const data = await res.json();
  const out = data?.data?.translations?.[0]?.translatedText;
  if (!out) throw new Error("Google: empty translation");
  return out;
}

async function viaMyMemory(text, target) {
  const params = new URLSearchParams({ q: text, langpair: `en|${target}` });
  if (EMAIL) params.set("de", EMAIL);
  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();
  const out = data?.responseData?.translatedText ?? "";
  if (data.responseStatus !== 200 || /MYMEMORY WARNING|QUOTA|INVALID/i.test(out)) {
    throw new Error(out || `status ${data.responseStatus}`);
  }
  return out;
}

/** Translate one English string into `target` (hi/gu). Throws on provider error. */
export async function translateText(text, target) {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return text;

  const term = GLOSSARY[trimmed];
  if (term && term[target]) return term[target];

  const { masked, tokens } = protect(text);
  const out = usingGoogle ? await viaGoogle(masked, target) : await viaMyMemory(masked, target);
  return restore(decodeEntities(out), tokens);
}
