"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import acceptLanguage from "accept-language";
import i18next, { dir } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { useCookies } from "react-cookie";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from "react-i18next";

import { cookieName, fallbackLng, getOptions, languages } from "./settings";

acceptLanguage.languages([...languages]);

void i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ["cookie", "navigator"],
      lookupCookie: cookieName,
    },
  });

function I18nProvider({ children }: { children: React.ReactNode }) {
  const [_cookies, setCookie] = useCookies([cookieName]);
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? fallbackLng;

  useEffect(() => {
    setCookie(cookieName, language, {
      path: "/",
      sameSite: true,
      expires: new Date(new Date().getTime() + 5 * 365 * 24 * 60 * 60 * 1000),
    });
  }, [language, setCookie]);

  return (
    <I18nextProvider i18n={i18n}>
      <Head>
        <html lang={language} dir={dir(language)} />
      </Head>
      {children}
    </I18nextProvider>
  );
}

const I18nProviderNoSSR = dynamic(() => Promise.resolve(I18nProvider), {
  ssr: false,
});

export { useTranslation, I18nProviderNoSSR as I18nProvider };
