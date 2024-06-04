import { Routes } from "discord-api-types/v10";
import { REST } from "discord.js";

import logger from "@mc/logger";

import { env } from "~/env";
import { availableLanguages, defaultLanguage, initI18n } from "~/i18n";
import { allCommands } from "~/interactions/commands";
import { localizeCommand } from "./localizeCommands";

export async function deployCommands() {
  const discordRest = new REST({
    version: "10",
  }).setToken(env.DISCORD_BOT_TOKEN);

  logger.info("deployCommands: Loading i18n instances for all languages.");
  const i18nInstances = await Promise.all(availableLanguages.map(initI18n));
  const i18nDefault = i18nInstances.find(
    (instance) => instance.language === defaultLanguage,
  );

  if (!i18nDefault) throw new Error("Failed to get the default i18n instance");

  logger.info("deployCommands: Localizing application commands.");

  const allDefinitions = allCommands.map(
    ({ commandDefinition, contextCommandDefinition }) => {
      return {
        commandDefinition: commandDefinition?.toJSON(),
        contextCommandDefinition: contextCommandDefinition?.toJSON(),
      };
    },
  );

  allDefinitions.forEach((defs) => {
    i18nInstances.forEach((i18nInstance) => {
      if (defs.commandDefinition)
        localizeCommand(i18nInstance, defs.commandDefinition, true);

      if (defs.contextCommandDefinition)
        localizeCommand(i18nInstance, defs.contextCommandDefinition, true);
    });

    if (defs.commandDefinition)
      localizeCommand(i18nDefault, defs.commandDefinition);

    if (defs.contextCommandDefinition)
      localizeCommand(i18nDefault, defs.contextCommandDefinition);
  });

  logger.info("deployCommands: Reloading application commands...");
  let route = Routes.applicationCommands(env.DISCORD_CLIENT_ID);

  if (env.DEPLOY_COMMANDS_TO_GUILD_ID) {
    route = Routes.applicationGuildCommands(
      env.DISCORD_CLIENT_ID,
      env.DEPLOY_COMMANDS_TO_GUILD_ID,
    );
  }

  const flattedDefs = allDefinitions
    .flatMap((defs) => Object.values(defs))
    .filter(Boolean);

  await discordRest.put(route, {
    body: flattedDefs,
  });

  logger.info("deployCommands: Successfully reloaded application commands.");
}
