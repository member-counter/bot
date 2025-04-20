import type Resources from "~/@types/resources";

export const fallbackLng = "en-US";
export const languages = [fallbackLng, "es-ES", "ru", "cs", "de"] as const;
export const languageEntries: Record<(typeof languages)[number], string> = {
  "en-US": "🇺🇸 English (US)",
  "es-ES": "🇪🇸 Español",
  ru: "🇷🇺 Русский",
  cs: "🇨🇿 Čeština",
  de: "🇩🇪 Deutsch",
};
export const defaultNS: keyof Resources = "main";
export const cookieName = "language";
export const namespaces: (keyof Resources)[] = ["main"];

export function getOptions(lng = fallbackLng) {
  return {
    supportedLngs: languages,
    lng,
    fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    ns: namespaces,
  };
}
