import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router";
import SuperJSON from "superjson";

import type { languages } from "~/lib/i18n";
import { api } from "~/lib/trpc";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import { NavigationBlockerProvider } from "./lib/navigation";
// Static imports for all locale bundles
import cs from "./locales/cs/main.json";
import de from "./locales/de/main.json";
import enUS from "./locales/en-US/main.json";
import esES from "./locales/es-ES/main.json";
import ru from "./locales/ru/main.json";

const localeResources: Record<string, { main: Record<string, unknown> }> = {
  "en-US": { main: enUS },
  "es-ES": { main: esES },
  ru: { main: ru },
  cs: { main: cs },
  de: { main: de },
};

// -- SSR-specific provider overrides --

// Cache one i18n instance per language
const i18nCache = new Map<string, typeof i18next>();

async function getI18n(lng: (typeof languages)[number]) {
  const cached = i18nCache.get(lng);
  if (cached) return cached;

  const instance = i18next.createInstance();
  await instance.init({
    lng,
    fallbackLng: "en-US",
    defaultNS: "main",
    ns: ["main"],
    resources: localeResources,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  });

  i18nCache.set(lng, instance);
  return instance;
}

function SSRTrpcProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const trpcClient = api.createClient({
    links: [
      httpLink({
        transformer: SuperJSON,
        url: "http://localhost/api/trpc",
      }),
    ],
  });

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  );
}

export default async function ServerApp({
  url,
  lang = "en-US",
}: {
  url: string;
  lang?: (typeof languages)[number];
}) {
  const i18n = await getI18n(lang);

  function SSRI18nProvider({ children }: { children: ReactNode }) {
    return (
      <I18nextProvider i18n={i18n} defaultNS="main">
        {children}
      </I18nextProvider>
    );
  }

  return (
    <AppProviders i18nProvider={SSRI18nProvider} trpcProvider={SSRTrpcProvider}>
      <StaticRouter location={url}>
        <NavigationBlockerProvider>
          <AppRoutes />
        </NavigationBlockerProvider>
      </StaticRouter>
    </AppProviders>
  );
}
