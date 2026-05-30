import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import enMessages from "../../messages/en.json";

type Messages = Record<string, unknown>;

/** Deep-merge `overlay` onto `base` (overlay wins). Used so any key missing in a
 *  locale falls back to its English text instead of throwing/showing blank. */
function deepMerge(base: Messages, overlay: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const existing = out[key];
    if (
      value && typeof value === "object" && !Array.isArray(value) &&
      existing && typeof existing === "object" && !Array.isArray(existing)
    ) {
      out[key] = deepMerge(existing as Messages, value as Messages);
    } else if (value !== undefined && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

/** Loads messages for the active locale, with English as a fallback base. */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const en = enMessages as Messages;
  if (locale === "en") {
    return { locale, messages: en };
  }

  const localeMessages = (await import(`../../messages/${locale}.json`)).default as Messages;
  return { locale, messages: deepMerge(en, localeMessages) };
});
