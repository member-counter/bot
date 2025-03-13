import type { Locale } from "discord.js";

declare module "i18next" {
  interface i18n {
    language: Locale;
    languages: Locale[];
    resolvedLanguage: Locale;
  }
}
