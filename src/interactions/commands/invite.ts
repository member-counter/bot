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
		.setDescription("description"),
	execute: async (command, { t }) => {
		const embed = new BaseMessageEmbed();

		embed.setDescription(
			t("commands.invite.description", {
				INVITE_URL: getBotInviteLink(null, config.discord.bot.officialBotId)
			})
		);

		embed.setThumbnail(twemojiURL("🤖"));

		const componentRow = new ActionRowBuilder<ButtonBuilder>();
		componentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: getBotInviteLink(null, config.discord.bot.officialBotId),
				label: t("commands.invite.addToServer")
			})
		);

		if (command.inGuild() && command.memberPermissions.has("ManageGuild")) {
			componentRow.addComponents(
				new ButtonBuilder({
					style: ButtonStyle.Link,
					url: getBotInviteLink(command.guildId),
					label: t("commands.invite.addToServerAin")
				})
			);
		}

		componentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: config.discord.supportServer.url,
				label: t("commands.invite.joinSupportServer")
			})
		);

		await command.reply({
			embeds: [embed],
			components: [componentRow],
			ephemeral: true
		});
	}
});
