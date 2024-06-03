import type { BaseInteraction, LocaleString } from "discord.js";
import { createInstance } from "i18next";

import mainUS from "./locales/en-US/main.json";
import mainES from "./locales/es-ES/main.json";
import mainRU from "./locales/ru/main.json";

export const availableLanguages: LocaleString[] = [
  "en-US",
  "en-GB",
  "es-ES",
  "es-419",
  "ru",
] as const;
export const defaultLanguage: LocaleString = "en-US";

export async function initI18n(interaction: string | BaseInteraction) {
  let requestedLanguage: string;

  if (typeof interaction === "string") {
    requestedLanguage = interaction;
  } else {
    requestedLanguage = interaction.locale;
  }

  const i18nextInstance = createInstance({
    lng: requestedLanguage,
    fallbackLng: [requestedLanguage, defaultLanguage],
    defaultNS: "main",
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

export const tKey = <
  K extends Parameters<Awaited<ReturnType<typeof initI18n>>["t"]>,
>(
  ...key: K
): K[0] => key[0];
