import codes from "iso-lang-codes";

import type { Searchable } from "~/app/components/AutocompleteInput";

export const locales = codes.locales();
export const searchableLocales: Searchable<string>[] = Object.entries(
  locales,
).map(([code, name]) => {
  return {
    value: code,
    keywords: name.replace("(", "").replace(")", "").split(" "),
  };
});
