import type { CommandInteraction } from "discord.js";

import { DEFAULT_LANGUAGE, initI18n } from "~/i18n";
import { commandDefinitionTKeyMap } from "~/utils/prepareLocalization";
import { configureCommand } from "./configure";
import { infoCommand } from "./info";
import { inviteCommand } from "./invite";
import { profileCommand } from "./profile";
import { setupCommand } from "./setup";

export const allCommands = [
  infoCommand,
  profileCommand,
  inviteCommand,
  configureCommand,
  setupCommand,
];

export function throwUnsupported(command: CommandInteraction) {
  throw new Error(`Unsupported command type ${command.commandType}`);
}

export default async function handleCommand(
  commandInteraction: CommandInteraction,
): Promise<void> {
  const { logger } = commandInteraction.client.botInstanceOptions;

  await commandInteraction.deferReply({ ephemeral: true });
  const i18nDefaultLanguage = await initI18n(DEFAULT_LANGUAGE);

  const command = allCommands.find((c) => {
    const commandNames = [c.slashDefinition?.name, c.contextDefinition?.name]
      .filter(Boolean)
      .map((commandName) => commandDefinitionTKeyMap.get(commandName))
      .map(
        (commandName) => i18nDefaultLanguage.t(commandName as never) as string,
      );

    if (!commandNames.length)
      throw new Error(
        "Command name couldn't be resolved, looks like you forgot to define the command in `commandDefinition` or `contextCommandDefinition` or use prepareLocalization() in its name",
      );

    return commandNames.some(
      (commandName) => commandName === commandInteraction.commandName,
    );
  });

  if (!command) {
    throw new Error(`Command ${commandInteraction.commandName} wasn't found`);
  }

  logger.debug(
    `${commandInteraction.user.username}#${
      commandInteraction.user.discriminator
    } (${
      commandInteraction.user.id
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
    }) is executing command ${commandInteraction.toString()} on channel ${
      commandInteraction.channel?.toString() ?? commandInteraction.channelId
    }`,
  );
  const i18n = await initI18n(commandInteraction);

  await command.handle(commandInteraction, i18n);
}
