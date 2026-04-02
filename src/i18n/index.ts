import { en } from "./en";
import { zh } from "./zh";

const translations = { en, zh } as const;

export type Locale = keyof typeof translations;

export function t(lang: Locale) {
  return translations[lang];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang === "zh") return "zh";
  return "en";
}
