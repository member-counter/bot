import { useEffect } from "react";
import { dir } from "i18next";
import { useCookies } from "react-cookie";
import { I18nextProvider, useTranslation } from "react-i18next";

import { cookieName } from ".";

function I18nProvider({ children }: { children: React.ReactNode }) {
  const [_cookies, setCookie] = useCookies([cookieName]);
  const { i18n } = useTranslation();
  const language = i18n.language;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir(language);

    setCookie(cookieName, language, {
      path: "/",
      sameSite: true,
      expires: new Date(new Date().getTime() + 5 * 365 * 24 * 60 * 60 * 1000),
    });
  }, [language, setCookie]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export { I18nProvider };
