"use client";

import type { KeyPrefix } from "i18next";
import type {
  FallbackNs,
  UseTranslationOptions,
  UseTranslationResponse,
} from "react-i18next";
import { useEffect, useState } from "react";
import acceptLanguage from "accept-language";
import i18next, { dir } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { useCookies } from "react-cookie";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";

import type Resources from "~/@types/resources";
import {
  cookieName,
  defaultNS,
  fallbackLng,
  getOptions,
  languages,
} from "./settings";

acceptLanguage.languages([...languages]);

const runsOnServerSide = typeof window === "undefined";

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
    preload: runsOnServerSide ? languages : [],
  });

// TODO remove this and move this logic to the provider
function useTranslation<
  Ns extends keyof Resources = "main",
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix>;
function useTranslation(ns = defaultNS, options = {}) {
  const [_cookies, setCookie] = useCookies([cookieName]);
  const ret = useTranslationOrg(ns, options);
  const retDef = useTranslationOrg(ns, { ...options, lng: fallbackLng });

  const { i18n } = ret;

  document.documentElement.lang = ret[1].resolvedLanguage ?? fallbackLng;
  document.documentElement.dir = dir(document.documentElement.lang);

  useEffect(() => {
    setCookie(cookieName, i18n.language, {
      path: "/",
      sameSite: true,
      expires: new Date(new Date().getTime() + 5 * 365 * 24 * 60 * 60 * 1000),
    });
  }, [i18n.language, setCookie]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? ret : retDef;
}
function I18nProvider({ children }: { children: React.ReactNode }) {
  const [_, i18n] = useTranslation();
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export { useTranslation, I18nProvider };
