import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./lib/i18n";
import "./globals.css";
import "@fontsource/major-mono-display/400.css";
import "@fontsource-variable/inter";

import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
