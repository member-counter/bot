import type { tKey } from "~/i18n";

let TKeyMapCounter = 0;
export const commandDefinitionTKeyMap = new Map<string, string>();

/**
 * Due to length and other regex limits imposed by the Discord.js slash command builder,
 * we cannot set localized names to a translation key because it's usually more than 32 characters long
 * and contains other forbidden characters
 * This will return an allowed ID that we can use later to retrive the actual translation keys when
 * translations are done in deployCommands()
 */
export function prepareLocalization(...key: Parameters<typeof tKey>): string {
  const keyId = (TKeyMapCounter++).toString();
  commandDefinitionTKeyMap.set(keyId, key[0] as never);
  return keyId;
}
