import type { ComponentType, ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

import { Toaster } from "@mc/ui/toaster";

import { I18nProvider } from "~/lib/i18n/provider";
import { TRPCReactProvider } from "~/lib/trpc";

interface AppProvidersProps {
  /** Override the default client-side i18n provider (e.g. for SSR). */
  i18nProvider?: ComponentType<{ children: ReactNode }>;
  /** Override the default client-side tRPC provider (e.g. for SSR). */
  trpcProvider?: ComponentType<{ children: ReactNode }>;
  children: ReactNode;
}

export default function AppProviders({
  i18nProvider: I18n = I18nProvider,
  trpcProvider: Trpc = TRPCReactProvider,
  children,
}: AppProvidersProps) {
  return (
    <CookiesProvider>
      <I18n>
        <Trpc>
          {children}
          <Toaster />
        </Trpc>
      </I18n>
    </CookiesProvider>
  );
}
