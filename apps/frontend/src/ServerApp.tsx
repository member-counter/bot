import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router";
import SuperJSON from "superjson";

import { api } from "~/lib/trpc";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import { NavigationBlockerProvider } from "./lib/navigation";
import enUS from "./locales/en-US/main.json";

// -- SSR-specific provider overrides --

let i18nSSR: typeof i18next | null = null;

async function getI18n() {
  if (i18nSSR) return i18nSSR;

  i18nSSR = i18next.createInstance();
  await i18nSSR.init({
    lng: "en-US",
    defaultNS: "main",
    ns: ["main"],
    resources: { "en-US": { main: enUS } },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  });

  return i18nSSR;
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

export default async function ServerApp({ url }: { url: string }) {
  const i18n = await getI18n();

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
