import type { ChatInputCommandInteraction } from "discord.js";

import logger from "@mc/logger";

import { defaultLanguage, initI18n } from "~/i18n";
import { commandDefinitionTKeyMap } from "~/utils/prepareLocalization";
import { infoCommand } from "./info";

export const allCommands = [infoCommand];

export default async function handleChatInputCommand(
  commandInteraction: ChatInputCommandInteraction,
): Promise<void> {
  const i18nDefaultLanguage = await initI18n(defaultLanguage);
  const command = allCommands.find(
    (c) =>
      i18nDefaultLanguage.t(
        commandDefinitionTKeyMap.get(c.definition.name) as never,
      ) === commandInteraction.commandName,
  );

  if (!command) {
    throw new Error(`Command ${commandInteraction.commandName} wasn't found`);
  }

  logger.debug(
    `${commandInteraction.user.username}#${
      commandInteraction.user.discriminator
    } (${
      commandInteraction.user.id
    }) is executing command ${commandInteraction.toString()} on channel ${
      commandInteraction.channel?.toString() ?? commandInteraction.channelId
    }`,
  );
  const i18n = await initI18n(commandInteraction);

  await command.handle(commandInteraction, i18n);
}
