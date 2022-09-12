import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";
import GuildSettings from "../../services/GuildSettings";

import { Command } from "../../structures";
import { UserError } from "../../utils/UserError";
import Emojis from "../../utils/emojis";
import logger from "../../logger";

export const setupCommand = new Command({
	// eslint-disable-next-line
	// @ts-ignore
	definition: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("untranslated")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("type")
				.setAutocomplete(true)
				.setDescription(
					"Select the type of counters you want to setup (optional)"
				)
		)
		.addStringOption((option) =>
			option
				.setName("input")
				.setDescription(
					"Provide the following input: Twitch (channel name) Youtube (channel link) Twitter (account name)"
				)
		),

	execute: async (
		command, // eslint-disable-next-line
		{ t }
	) => {
		if (!command.inGuild()) throw new UserError("common.error.noDm");
		if (!command.memberPermissions.has(PermissionFlagsBits.Administrator))
			throw new UserError("common.error.noPermissions");
		const guildSettings = await GuildSettings.init(command.guildId);
		await command.guild.fetch();

		let type = command.options.get("type").value as string;
		const input = command.options.get("input");
		const emojis = Emojis(
			command.appPermissions.has(PermissionFlagsBits.UseExternalEmojis)
		);
		const availableSetups = ["youtube", "twitch", "twitter"];
		if (type && !availableSetups.includes(type)) type = "default";
		logger.debug(JSON.stringify(input, null, 2));

		logger.debug(JSON.stringify(emojis, null, 2));

		logger.debug(JSON.stringify(guildSettings, null, 2));
	}
});
