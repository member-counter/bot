import type logger from "@mc/logger";
import type { Locale } from "discord.js";
import type i18next from "i18next";
import { Routes } from "discord-api-types/v10";
import { REST } from "discord.js";

import type { InitI18NOptions } from "./i18n";
import type { Command } from "./structures/Command";
import { localizeCommand } from "./i18n/localizeCommands";

interface DeployCommandsOptions {
  token: string;
  deployCommands: boolean | string;
  logger: typeof logger;
  availableLanguages: Locale[];
  defaultLanguage: Locale;
  initI18n: (opts: InitI18NOptions) => Promise<typeof i18next>;
  commands: Command[];
}

export async function deployCommands({
  deployCommands,
  commands,
  token,
  logger,
  availableLanguages,
  defaultLanguage,
  initI18n,
}: DeployCommandsOptions) {
  if (!deployCommands) return;

  const clientId = Buffer.from(token.split(".")[0] ?? "", "base64").toString();
  const discordRest = new REST({
    version: "10",
  }).setToken(token);

  logger.info("deployCommands: Loading i18n instances for all languages.");
  const i18nInstances = await Promise.all(
    availableLanguages.map((locale) => initI18n({ locale })),
  );
  const i18nDefault = i18nInstances.find(
    (instance) => (instance.language as Locale) === defaultLanguage,
  );

  if (!i18nDefault) throw new Error("Failed to get the default i18n instance");

  logger.info("deployCommands: Localizing application commands.");

  const allDefinitions = commands
    .flatMap(({ slashDefinition, contextDefinition }) => {
      return [slashDefinition?.toJSON(), contextDefinition?.toJSON()];
    })
    .filter(Boolean);

  allDefinitions.forEach((defs) => {
    i18nInstances.forEach((i18nInstance) => {
      localizeCommand(i18nInstance, defs, true);
    });

    localizeCommand(i18nDefault, defs);
  });

  logger.info("deployCommands: Reloading application commands...");
  let route = Routes.applicationCommands(clientId);

  if (typeof deployCommands === "string") {
    route = Routes.applicationGuildCommands(clientId, deployCommands);
  }

  await discordRest.put(route, {
    body: allDefinitions,
  });

  logger.info("deployCommands: Successfully reloaded application commands.");
}
