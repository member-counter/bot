import acceptLanguage from "accept-language";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import type Resources from "~/@types/resources";

export const fallbackLng = "en-US";
export const languages = [
  fallbackLng,
  "es-ES",
  "ru",
  "cs",
  "de",
  "tr",
  "el",
  "fi",
  "fr",
  "it",
  "ja",
  "ko",
  "nl",
  "no",
  "pl",
  "sv-SE",
  "zh-CN",
] as const;
export const languageEntries: Record<(typeof languages)[number], string> = {
  "en-US": "🇺🇸 English (US)",
  "es-ES": "🇪🇸 Español",
  ru: "🇷🇺 Русский",
  cs: "🇨🇿 Čeština",
  de: "🇩🇪 Deutsch",
  tr: "🇹🇷 Türkçe",
  el: "🇬🇷 Ελληνικά",
  fi: "🇫🇮 Suomi",
  fr: "🇫🇷 Français",
  it: "🇮🇹 Italiano",
  ja: "🇯🇵 日本語",
  ko: "🇰🇷 한국어",
  nl: "🇳🇱 Nederlands",
  no: "🇳🇴 Norsk",
  pl: "🇵🇱 Polski",
  "sv-SE": "🇸🇪 Svenska",
  "zh-CN": "🇨🇳 简体中文",
};
export const defaultNS: keyof Resources = "main";
export const cookieName = "language";
export const namespaces: (keyof Resources)[] = ["main"];

acceptLanguage.languages([...languages]);

void i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    supportedLngs: languages,
    fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    ns: namespaces,
    lng: undefined, // let detect the language
    detection: {
      order: ["cookie", "navigator"],
      lookupCookie: cookieName,
    },
  });
