import { Routes } from "discord-api-types/v10";
import { REST } from "discord.js";

import logger from "@mc/logger";

import { env } from "~/env";
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, initI18n } from "~/i18n";
import { allCommands } from "~/interactions/commands";
import { localizeCommand } from "./localizeCommands";

export async function deployCommands() {
  const discordRest = new REST({
    version: "10",
  }).setToken(env.DISCORD_BOT_TOKEN);

  logger.info("deployCommands: Loading i18n instances for all languages.");
  const i18nInstances = await Promise.all(AVAILABLE_LANGUAGES.map(initI18n));
  const i18nDefault = i18nInstances.find(
    (instance) => instance.language === DEFAULT_LANGUAGE,
  );

  if (!i18nDefault) throw new Error("Failed to get the default i18n instance");

  logger.info("deployCommands: Localizing application commands.");

  const allDefinitions = allCommands.map(
    ({ slashDefinition, contextDefinition }) => {
      return {
        slash: slashDefinition?.toJSON(),
        context: contextDefinition?.toJSON(),
      };
    },
  );

  allDefinitions.forEach((defs) => {
    i18nInstances.forEach((i18nInstance) => {
      if (defs.slash) localizeCommand(i18nInstance, defs.slash, true);

      if (defs.context) localizeCommand(i18nInstance, defs.context, true);
    });

    if (defs.slash) localizeCommand(i18nDefault, defs.slash);

    if (defs.context) localizeCommand(i18nDefault, defs.context);
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
