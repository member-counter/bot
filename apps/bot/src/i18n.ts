import type { InitI18NOptions } from "@mc/common/bot/i18n/index";
import { Locale } from "discord.js";
import { createInstance } from "i18next";

import type Resources from "./@types/resources";
import mainCS from "./locales/cs/main.json";
import mainDE from "./locales/de/main.json";
import mainUS from "./locales/en-US/main.json";
import mainES from "./locales/es-ES/main.json";
import mainRU from "./locales/ru/main.json";

export const AVAILABLE_LANGUAGES: Locale[] = [
  Locale.EnglishUS,
  Locale.EnglishGB,
  Locale.SpanishES,
  Locale.SpanishLATAM,
  Locale.Russian,
  Locale.Czech,
  Locale.German,
] as const;
export const DEFAULT_LANGUAGE: Locale = Locale.EnglishUS;
export const NAMESPACES: (keyof Resources)[] = ["main"];

export async function initI18n({ locale }: InitI18NOptions) {
  const i18nextInstance = createInstance({
    lng: locale,
    supportedLngs: AVAILABLE_LANGUAGES,
    fallbackLng: [locale, DEFAULT_LANGUAGE],
    defaultNS: "main",
    ns: NAMESPACES,
    resources: {
      [Locale.EnglishUS]: {
        main: mainUS,
      },
      [Locale.EnglishGB]: {
        main: mainUS,
      },
      [Locale.SpanishES]: {
        main: mainES,
      },
      [Locale.SpanishLATAM]: {
        main: mainES,
      },
      [Locale.Russian]: {
        main: mainRU,
      },
      [Locale.Czech]: {
        main: mainCS,
      },
      [Locale.German]: {
        main: mainDE,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  await i18nextInstance.init();

  return i18nextInstance;
}
