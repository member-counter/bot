#!/usr/bin/env node
import { Routes, Locale } from "discord-api-types/v10";
import { SlashCommandBuilder } from "discord.js";

import config from "../config";
import { allCommands, allCommandNames } from "../interactions/commands";
import logger from "../logger";
import { discordRest } from "../services";
import { availableLocales, i18nService } from "../services/i18n";
import { tokenToClientId } from "../utils/tokenToClientId";

const clientId = tokenToClientId(config.discord.bot.token);

export async function deployCommands() {
	try {
		logger.info("deployCommands: Loading i18n instances for all languages.");
		const i18nInstances = await Promise.all(availableLocales.map(i18nService));
		const i18nDefault = i18nInstances.find(
			(instance) => instance.language === config.i18n.defaultLocale
		);

		logger.info("deployCommands: Localizing application commands.");
		i18nInstances.forEach(({ language, t }) => {
			let locale = language as Locale;

			if (!Object.values(Locale).includes(locale)) {
				locale = locale.split("-")[0] as Locale;
			}

			if (!Object.values(Locale).includes(locale)) {
				return;
			}

			allCommands.forEach(({ definition }, index) => {
				if (definition instanceof SlashCommandBuilder) {
					// TODO: Fix typing for definition name
					definition.setDescription(
						i18nDefault.t(
							`commands.${allCommandNames[index]}.definition.description`
						)
					);

					definition.setNameLocalization(
						locale,
						t(`commands.${allCommandNames[index]}.definition.name`)
					);
					definition.setDescriptionLocalization(
						locale,
						t(`commands.${allCommandNames[index]}.definition.description`)
					);
				}
			});
		});

		logger.info("deployCommands: Started refreshing application commands.");
		await discordRest.put(
			config.test.deployInteractionCommandGuildId?.length
				? Routes.applicationGuildCommands(
						clientId,
						config.test.deployInteractionCommandGuildId
				  )
				: Routes.applicationCommands(clientId),
			{
				body: allCommands.map((cmd) => cmd.definition.toJSON())
			}
		);

		logger.info("deployCommands: Successfully reloaded application commands.");
	} catch (error) {
		logger.error(JSON.stringify(error));
	}
}
