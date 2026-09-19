import type { InitI18NOptions } from "@mc/common/bot/i18n/index";
import { Locale } from "discord.js";
import { createInstance } from "i18next";

import type Resources from "./@types/resources";
import mainCS from "./locales/cs/main.json";
import mainDE from "./locales/de/main.json";
import mainEL from "./locales/el/main.json";
import mainUS from "./locales/en-US/main.json";
import mainES from "./locales/es-ES/main.json";
import mainFI from "./locales/fi/main.json";
import mainFR from "./locales/fr/main.json";
import mainIT from "./locales/it/main.json";
import mainJA from "./locales/ja/main.json";
import mainKO from "./locales/ko/main.json";
import mainNL from "./locales/nl/main.json";
import mainNO from "./locales/no/main.json";
import mainPL from "./locales/pl/main.json";
import mainRU from "./locales/ru/main.json";
import mainSV from "./locales/sv-SE/main.json";
import mainTR from "./locales/tr/main.json";
import mainZH from "./locales/zh-CN/main.json";

export const AVAILABLE_LANGUAGES: Locale[] = [
  Locale.EnglishUS,
  Locale.EnglishGB,
  Locale.SpanishES,
  Locale.SpanishLATAM,
  Locale.Russian,
  Locale.Czech,
  Locale.German,
  Locale.Turkish,
  Locale.Greek,
  Locale.Finnish,
  Locale.French,
  Locale.Italian,
  Locale.Japanese,
  Locale.Korean,
  Locale.Dutch,
  Locale.Norwegian,
  Locale.Polish,
  Locale.Swedish,
  Locale.ChineseCN,
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
      [Locale.Turkish]: {
        main: mainTR,
      },
      [Locale.Greek]: {
        main: mainEL,
      },
      [Locale.Finnish]: {
        main: mainFI,
      },
      [Locale.French]: {
        main: mainFR,
      },
      [Locale.Italian]: {
        main: mainIT,
      },
      [Locale.Japanese]: {
        main: mainJA,
      },
      [Locale.Korean]: {
        main: mainKO,
      },
      [Locale.Dutch]: {
        main: mainNL,
      },
      [Locale.Norwegian]: {
        main: mainNO,
      },
      [Locale.Polish]: {
        main: mainPL,
      },
      [Locale.Swedish]: {
        main: mainSV,
      },
      [Locale.ChineseCN]: {
        main: mainZH,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  await i18nextInstance.init();

  return i18nextInstance;
}
