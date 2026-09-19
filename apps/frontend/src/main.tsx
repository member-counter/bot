import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import { cookieName } from "./lib/i18n";

import "./globals.css";
import "@fontsource/major-mono-display/400.css";
import "@fontsource-variable/inter";

import ClientApp from "./ClientApp";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ClientApp />
  </StrictMode>
);

// Hydrate only when the pre-rendered language matches the client's language.
// The <html lang> attribute is set per language variant during prerender.
// Compare base language prefixes (e.g. "en" from "en-US") to handle
// mismatches like navigator returning "en" vs pre-rendered "en-US".
const hasPrerenderedContent = rootElement.childNodes.length > 0;
const prerenderedLang = document.documentElement.lang;
const clientLang =
  document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1] ?? navigator.language;
const canHydrate =
  hasPrerenderedContent &&
  prerenderedLang.split("-")[0] === clientLang.split("-")[0];

if (canHydrate) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
