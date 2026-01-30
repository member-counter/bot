import { CookiesProvider } from "react-cookie";

import { Toaster } from "@mc/ui/toaster";

import { I18nProvider } from "~/lib/i18n/provider";
import { TRPCReactProvider } from "~/lib/trpc";
import Router from "./router";

export default function App() {
  return (
    <CookiesProvider>
      <I18nProvider>
        <TRPCReactProvider>
          <Router />
          <Toaster />
        </TRPCReactProvider>
      </I18nProvider>
    </CookiesProvider>
  );
}
