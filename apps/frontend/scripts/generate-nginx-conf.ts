import fs from "node:fs";
import path from "node:path";

import { fallbackLng, languages } from "../src/lib/i18n";

const rootDir = path.resolve(import.meta.dirname, "..");

const template = fs.readFileSync(
  path.join(rootDir, "nginx.conf.template"),
  "utf-8",
);

// Map each language to its base prefix for Accept-Language matching
// e.g. "en-US" → "en", "es-ES" → "es", "ru" → "ru"
function langPrefix(lang: string): string {
  return lang.split("-")[0] ?? lang;
}

// Cookie map: exact match on the language cookie value
const cookieEntries = languages
  .map(
    (lang) =>
      `    "${lang}"${" ".repeat(Math.max(1, 8 - lang.length))}"${lang}";`,
  )
  .join("\n");

// Accept-Language map: match the base language prefix (case-insensitive)
// Deduplicate prefixes (e.g. if "en" and "en-US" both map to "en-US")
const seenPrefixes = new Set<string>();
const acceptEntries = languages
  .filter((lang) => {
    const prefix = langPrefix(lang);
    if (seenPrefixes.has(prefix)) return false;
    seenPrefixes.add(prefix);
    return true;
  })
  .map(
    (lang) =>
      `    "~*^${langPrefix(lang)}"${" ".repeat(Math.max(1, 6 - langPrefix(lang).length))}"${lang}";`,
  )
  .join("\n");

const output = template
  .replace("{{COOKIE_LANG_ENTRIES}}", cookieEntries)
  .replace("{{ACCEPT_LANG_ENTRIES}}", acceptEntries)
  .replace("{{FALLBACK_LNG}}", fallbackLng);

const distDir = path.join(rootDir, "dist");
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "nginx.conf"), output);

console.log(
  `Generated nginx.conf with ${languages.length} languages (fallback: ${fallbackLng})`,
);
