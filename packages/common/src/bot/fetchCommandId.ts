import type { Client, Locale } from "discord.js";
import type i18next from "i18next";

import type { InitI18NOptions, TKey } from "./i18n";

interface FetchCommandIdOptions {
  client: Client<true>;
  tkey: TKey;
  defaultLanguage: Locale;
  initI18n: (opts: InitI18NOptions) => Promise<typeof i18next>;
}

export async function fetchCommandId({
  client,
  tkey,
  initI18n,
  defaultLanguage,
}: FetchCommandIdOptions) {
  const defaultI18nInstance = await initI18n({ locale: defaultLanguage });

  const translatedCommandName = defaultI18nInstance.t(tkey);
  const foundCommand = (await client.application.commands.fetch()).find(
    (command) => command.name === translatedCommandName,
  );

  if (!foundCommand)
    throw new Error(`${translatedCommandName} command couldn't be fetched`);

  return foundCommand.id;
}
