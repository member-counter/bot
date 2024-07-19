import { cookies } from "next/headers";
import acceptLanguage from "accept-language";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

import { cookieName, fallbackLng, getOptions, languages } from "./settings";

acceptLanguage.languages([...languages]);

const initI18next = async (lng: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`),
      ),
    )
    .init(getOptions(lng));
  return i18nInstance;
};

export async function translation() {
  const lng =
    acceptLanguage.get(cookies().get(cookieName)?.value) ?? fallbackLng;

  const i18nextInstance = await initI18next(lng);

  return [i18nextInstance.getFixedT(lng), i18nextInstance];
}
