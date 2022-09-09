#!/usr/bin/env node
import { Routes } from "discord-api-types/v10";

import config from "../config";
import { allCommands } from "../interactions/commands";
import logger from "../logger";
import { discordRest } from "../services";
import { tokenToClientId } from "../utils/tokenToClientId";

const clientId = tokenToClientId(config.discord.bot.token);

export async function deployCommands() {
	try {
		logger.info("Started refreshing application (/) commands.");
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

		logger.info("Successfully reloaded application (/) commands.");
	} catch (error) {
		logger.error(
			JSON.stringify(allCommands.map((cmd) => cmd.definition.toJSON())),
			JSON.stringify(error)
		);
	}
}
