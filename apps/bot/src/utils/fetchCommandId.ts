import type { Client } from "discord.js";

import type { TKey } from "~/i18n";
import { DEFAULT_LANGUAGE, initI18n } from "~/i18n";

export async function fetchCommandId(client: Client<true>, tkey: TKey) {
  const defaultI18nInstance = await initI18n(DEFAULT_LANGUAGE);

  const translatedCommandName = defaultI18nInstance.t(tkey);
  const foundCommand = (await client.application.commands.fetch()).find(
    (command) => command.name === translatedCommandName,
  );

  if (!foundCommand)
    throw new Error(`${translatedCommandName} command couldn't be fetched`);

  return foundCommand.id;
}
