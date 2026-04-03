import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import "./lib/i18n";
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

if (rootElement.childNodes.length > 0) {
  // Pre-rendered HTML exists (home page) — hydrate to preserve it
  hydrateRoot(rootElement, app);
} else {
  // No pre-rendered content — standard SPA mount
  createRoot(rootElement).render(app);
}
