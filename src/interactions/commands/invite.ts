import {
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder
} from "@discordjs/builders";
import { ButtonStyle } from "discord.js";
import config from "../../config";

import { Command } from "../../structures";
import BaseMessageEmbed from "../../utils/BaseMessageEmbed";
import getBotInviteLink from "../../utils/getBotInviteLink";
import { twemojiURL } from "../../utils/twemojiURL";

export const inviteCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Gives you an invite link to add the bot"),
	execute: async (command, { txt }) => {
		const embed = new BaseMessageEmbed();

		embed.setDescription(
			await txt("COMMAND_INVITE_DESCRIPTION", {
				INVITE_URL: getBotInviteLink(null, config.discord.bot.officialBotId)
			})
		);

		embed.setThumbnail(twemojiURL("🤖"));

		const componentRow = new ActionRowBuilder<ButtonBuilder>();
		componentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: getBotInviteLink(null, config.discord.bot.officialBotId),
				label: await txt("COMMAND_INVITE_ADD_TO_SERVER")
			})
		);

		if (command.inGuild() && command.memberPermissions.has("ManageGuild")) {
			componentRow.addComponents(
				new ButtonBuilder({
					style: ButtonStyle.Link,
					url: getBotInviteLink(command.guildId),
					label: await txt("COMMAND_INVITE_ADD_TO_SERVER_AGAIN")
				})
			);
		}

		componentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: config.discord.supportServer.url,
				label: await txt("COMMAND_INVITE_JOIN_SUPPORT_SERVER")
			})
		);

		await command.reply({
			embeds: [embed],
			components: [componentRow],
			ephemeral: true
		});
	}
});
