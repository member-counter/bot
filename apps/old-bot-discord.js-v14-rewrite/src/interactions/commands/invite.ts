import {
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder
} from "@discordjs/builders";
import { ButtonStyle } from "discord.js";

import config from "../../config";
import { Command } from "../../structures";
import { BaseMessageEmbed, getBotInviteLink } from "../../utils";
import { twemojiURL } from "../../utils";

export const inviteCommand = new Command<"invite">({
	name: "invite",
	definition: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("untranslated"),
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
					label: t("commands.invite.addToServerAgain")
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
		if (command.appPermissions.has("EmbedLinks")) {
			await command.reply({
				embeds: [embed],
				components: [componentRow],
				ephemeral: true
			});
		} else {
			await command.reply({
				content: t("commands.invite.description", {
					INVITE_URL: getBotInviteLink(null, config.discord.bot.officialBotId)
				}),
				components: [componentRow],
				ephemeral: true
			});
		}
	},
	// TODO: set the right intents and permissions
	neededIntents: [
		"GuildMessageTyping",
		"GuildMembers",
		"GuildEmojisAndStickers",
		"Guilds"
	],
	neededPermissions: ["SendMessages", "ViewChannel"]
});
