import type { ChatInputCommandInteraction, Interaction } from "discord.js";
import { createInstance } from "i18next";

const availableLanguages = ["en-US", "es-ES", "ru-RU"] as const;
type AvailableLanguage = (typeof availableLanguages)[number];
const defaultLanguage: AvailableLanguage = "en-US";

const LocalBackend: {
  cache: {
    [K in string]?: unknown;
  };
  type: "backend";
  read: (
    language: AvailableLanguage,
    namespace: string,
    callback: (err: unknown, translations: unknown) => void,
  ) => Promise<void>;
} = {
  cache: {},
  type: "backend",
  read: async function (requestedLanguage, namespace, callback) {
    try {
      let resources: unknown;

      try {
        resources = await import(
          `./locales/${requestedLanguage}/${namespace}.json`
        );
      } catch {
        const partialRequestedLanguage = requestedLanguage.split("-")[0];
        const bestNextMatch = partialRequestedLanguage
          ? availableLanguages.find((language) => {
              return language.startsWith(partialRequestedLanguage);
            })
          : defaultLanguage;

        resources ??= await import(
          `./locales/${bestNextMatch}/${namespace}.json`
        );
      }

      callback(null, (LocalBackend.cache[requestedLanguage] ??= resources));
    } catch (err) {
      console.log(err);

      callback(err, null);
    }
  },
};

export async function initT(
  interaction: string | Interaction | ChatInputCommandInteraction,
) {
  let requestedLanguage: string;

  if (typeof interaction === "string") {
    requestedLanguage = interaction;
  } else {
    requestedLanguage = interaction.locale;
  }

  const i18nextInstance = createInstance({
    ns: "main",
  }).use(LocalBackend);

  await i18nextInstance.init({
    fallbackLng: [requestedLanguage, defaultLanguage],
    load: "currentOnly",
  });

  return i18nextInstance.t;
}
