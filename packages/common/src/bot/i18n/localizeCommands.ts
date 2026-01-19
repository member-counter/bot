import type {
  APIApplicationCommandOption,
  Locale,
  LocalizationMap,
} from "discord.js";
import type { i18n } from "i18next";

import { commandDefinitionTKeyMap } from "./prepareLocalization";

type LocaleString = `${Locale}`;

interface SimplifiedCommandDefinition {
  name: string;
  description?: string;
  name_localizations?: LocalizationMap | null;
  description_localizations?: LocalizationMap | null;
  options?: APIApplicationCommandOption[];
}

export function localizeCommand(
  i18nInstance: i18n,
  def:
    | SimplifiedCommandDefinition
    | Omit<SimplifiedCommandDefinition, "options">,
  skipNameAndDesc = false,
) {
  def.name_localizations ??= {};
  def.description_localizations ??= {};

  const nameKey = commandDefinitionTKeyMap.get(def.name);
  const descKey = commandDefinitionTKeyMap.get(def.description ?? "");

  if (!skipNameAndDesc) {
    if (nameKey) def.name = i18nInstance.t(nameKey as never);
    if (descKey) def.description = i18nInstance.t(descKey as never);
  }

  if (nameKey) {
    def.name_localizations[i18nInstance.language as LocaleString] =
      i18nInstance.t(nameKey as never);
  }

  if (descKey) {
    def.description_localizations[i18nInstance.language as LocaleString] =
      i18nInstance.t(descKey as never);
  }

  if ("options" in def) {
    def.options?.forEach((option) => {
      localizeCommand(i18nInstance, option, skipNameAndDesc);

      if ("choices" in option) {
        option.choices?.forEach((choice) => {
          localizeCommand(i18nInstance, choice, false);
        });
      }
    });
  }

  return def;
}
