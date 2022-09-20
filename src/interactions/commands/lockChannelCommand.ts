import { SlashCommandBuilder } from "@discordjs/builders";
import {
	ChannelType,
	OverwriteType,
	PermissionFlagsBits,
	PermissionsBitField,
	VoiceChannel
} from "discord.js";

import { Command } from "../../structures";
import { botHasPermsToEdit, UserError } from "../../utils";

// TODO: i18n
export const lockChannelCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("lock-channel")
		.setDescription("untranslated")
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("untranslated")
				.addChannelTypes(ChannelType.GuildVoice)
				.setRequired(true)
		),
	execute: async (command, { t }) => {
		const { success, errorNoPerms } = t("commands.lockChannel", {
			returnObjects: true
		});
		const channelId = command.options.get("channel", true).value as string;

		const { channel, client } = command;

		const { guild } = channel;

		if (guild.channels.cache.has(channelId)) {
			const channelToEdit = guild.channels.cache.get(channelId);
			if (channelToEdit instanceof VoiceChannel) {
				if (botHasPermsToEdit(channelToEdit)) {
					await channelToEdit.edit({
						permissionOverwrites: [
							{
								id: client.user.id,
								type: OverwriteType.Member,
								allow: new PermissionsBitField().add([
									PermissionFlagsBits.Connect,
									PermissionFlagsBits.ViewChannel
								])
							},
							{
								id: guild.id,
								type: OverwriteType.Role,
								deny: new PermissionsBitField().add([
									PermissionFlagsBits.Connect
								])
							}
						]
					});
				} else {
					throw new UserError(
						errorNoPerms.replace(
							/\{CHANNEL\}/gi,
							`${command.guild.channels.cache.get(channelId)}`
						)
					);
				}
			}
		}

		await command.reply({ content: success, ephemeral: true });
	},
	neededIntents: [
		"GuildMembers",
		"Guilds",
		"GuildBans",
		"GuildMessages",
		"DirectMessages",
		"GuildMessageReactions",
		"DirectMessageReactions"
	],
	neededPermissions: [
		"ManageChannels",
		"ViewChannel",
		"Connect",
		"ReadMessageHistory",
		"SendMessages",
		"EmbedLinks",
		"AddReactions",
		"ManageRoles",
		"ManageMessages",
		"BanMembers"
	]
});
