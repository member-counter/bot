#!/usr/bin/env node
import config from "../config";
import { Routes } from "discord-api-types/v10";
import { allCommands } from "../interactions/commands";
import { discordRest } from "../services";
import { tokenToClientId } from "../utils/tokenToClientId";

const clientId = tokenToClientId(config.discord.bot.token);

export async function deployCommands() {
	try {
		console.log("Started refreshing application (/) commands.");
		await discordRest.put(
			config.test.deployInteractonCommandGuildId?.length
				? Routes.applicationGuildCommands(
						clientId,
						config.test.deployInteractonCommandGuildId
				  )
				: Routes.applicationCommands(clientId),
			{
				body: allCommands.map((cmd) => cmd.definition.toJSON())
			}
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(
			JSON.stringify(allCommands.map((cmd) => cmd.definition.toJSON())),
			JSON.stringify(error)
		);
	}
}
