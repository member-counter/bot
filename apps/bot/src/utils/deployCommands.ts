import type logger from "@mc/logger";
import { Routes } from "discord-api-types/v10";
import { REST } from "discord.js";

import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, initI18n } from "~/i18n";
import { allCommands } from "~/interactions/commands";
import { localizeCommand } from "./localizeCommands";

interface DeployCommandsOptions {
  token: string;
  deployCommands: boolean | string;
  logger: typeof logger;
}

export async function deployCommands({
  deployCommands,
  token,
  logger,
}: DeployCommandsOptions) {
  if (!deployCommands) return;

  const clientId = Buffer.from(token.split(".")[0] ?? "", "base64").toString();
  const discordRest = new REST({
    version: "10",
  }).setToken(token);

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
  let route = Routes.applicationCommands(clientId);

  if (typeof deployCommands === "string") {
    route = Routes.applicationGuildCommands(clientId, deployCommands);
  }

  const flattedDefs = allDefinitions
    .flatMap((defs) => Object.values(defs))
    .filter(Boolean);

  await discordRest.put(route, {
    body: flattedDefs,
  });

  logger.info("deployCommands: Successfully reloaded application commands.");
}
