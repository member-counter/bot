import type { BaseInteraction, LocaleString } from "discord.js";
import { createInstance } from "i18next";

import type Resources from "./@types/resources";
import mainUS from "./locales/en-US/main.json";
import mainES from "./locales/es-ES/main.json";
import mainRU from "./locales/ru/main.json";

export const AVAILABLE_LANGUAGES: LocaleString[] = [
  "en-US",
  "en-GB",
  "es-ES",
  "es-419",
  "ru",
] as const;
export const DEFAULT_LANGUAGE: LocaleString = "en-US";
export const NAMESPACES: (keyof Resources)[] = ["main"];

export async function initI18n(interaction: LocaleString | BaseInteraction) {
  let requestedLanguage: string;

  if (typeof interaction === "string") {
    requestedLanguage = interaction;
  } else {
    requestedLanguage = interaction.locale;
  }

  const i18nextInstance = createInstance({
    lng: requestedLanguage,
    supportedLngs: AVAILABLE_LANGUAGES,
    fallbackLng: [requestedLanguage, DEFAULT_LANGUAGE],
    defaultNS: "main",
    ns: NAMESPACES,
    resources: {
      "en-US": {
        main: mainUS,
      },
      "en-GB": {
        main: mainUS,
      },
      "es-ES": {
        main: mainES,
      },
      "es-419": {
        main: mainES,
      },
      ru: {
        main: mainRU,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  await i18nextInstance.init();

  return i18nextInstance;
}

export type TFunction = Awaited<ReturnType<typeof initI18n>>["t"];

type Unpacked<T> = T extends (infer U)[] ? U : T;
export type TKey<K = Parameters<TFunction>[0]> = K extends
  | string
  | string[]
  | TemplateStringsArray
  ? never
  : Exclude<Unpacked<K>, TemplateStringsArray>;

export const tKey = <K extends TKey>(key: K): K => key;
