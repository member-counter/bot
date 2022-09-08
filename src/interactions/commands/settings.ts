import {
	ActionRowBuilder,
	ButtonBuilder,
	inlineCode,
	SlashCommandBuilder
} from "@discordjs/builders";
import { ButtonStyle, PermissionsBitField } from "discord.js";

import GuildSettings from "../../services/GuildSettings";
import { i18n } from "../../services/i18n";
import { Command } from "../../structures";
import BaseMessageEmbed from "../../utils/BaseMessageEmbed";
import Paginator from "../../utils/Paginator";
import safeDiscordString from "../../utils/safeDiscordString";
import { UserError } from "../../utils/UserError";
import { buttonId as deleteGuildSettingsButtonId } from "../buttons/deleteGuildSettings";

export const settingsCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("settings")
		.setDescription(
			"Configure and see different aspects about the bot in this server"
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("see")
				.setDescription("See different aspects about the bot in this server")
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("set")
				.setDescription(
					"Configure different aspects about the bot in this server"
				)
				.addStringOption((option) =>
					option
						.setName("language")
						.setDescription("Changes the language of this bot")
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("logs")
				.setDescription("See the bot logs for more information")
		),
	execute: {
		see: async (command, txt) => {
			if (!command.inGuild()) throw new UserError("COMMON_ERROR_NO_DM");
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError("COMMON_ERROR_NO_PERMISSIONS");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();

			const embed = new BaseMessageEmbed({
				title: await txt("COMMAND_SETTINGS_SEE_TITLE", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				}),
				fields: [
					{
						name: await txt("COMMAND_SETTINGS_SEE_LANGUAGE"),
						value: guildSettings.locale
							? await txt("LANG_NAME")
							: await txt("COMMAND_SETTINGS_SEE_LANGUAGE_DEFAULT_VALUE", {
									CURRENT_LANGUAGE: await txt("LANG_NAME")
							  })
					}
				]
			});

			const componentRow = new ActionRowBuilder<ButtonBuilder>();

			componentRow.addComponents(
				new ButtonBuilder({
					style: ButtonStyle.Danger,
					label: await txt("COMMAND_SETTINGS_BUTTON_DELETE_ALL"),
					custom_id: deleteGuildSettingsButtonId,
					emoji: { name: "🗑" }
				})
			);

			await command.reply({
				embeds: [embed],
				components: [componentRow]
			});
		},
		set: async (command, txt) => {
			if (!command.inGuild()) throw new UserError("COMMON_ERROR_NO_DM");
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError("COMMON_ERROR_NO_PERMISSIONS");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();
			const embed = new BaseMessageEmbed();

			// Language (handle it ASAP before using txt)
			if (command.options.get("language", false)) {
				const error = await guildSettings
					.setLocale(command.options.get("language", false).value.toString())
					.catch((e) => e);

				txt = await i18n(guildSettings.locale ?? command.guildLocale);

				embed.addFields([
					{
						name: await txt("COMMAND_SETTINGS_SEE_LANGUAGE"),
						value: error?.message
							? await txt(error?.message)
							: guildSettings.locale
							? await txt("LANG_NAME")
							: await txt("COMMAND_SETTINGS_SEE_LANGUAGE_DEFAULT_VALUE", {
									CURRENT_LANGUAGE: await txt("LANG_NAME")
							  })
					}
				]);
			}

			// Summary
			embed.setTitle(
				await txt("COMMAND_SETTINGS_SEE_TITLE", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				})
			);

			if (!embed.data.fields?.length) {
				embed.setDescription(await txt("COMMAND_SETTINGS_SET_NO_CHANGES_MADE"));
			} else {
				embed.setDescription(await txt("COMMAND_SETTINGS_SET_CHANGES_MADE"));
			}

			await command.reply({
				embeds: [embed],
				ephemeral: true
			});
		},
		logs: async (command, txt) => {
			if (!command.inGuild()) throw new UserError("COMMON_ERROR_NO_DM");
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError("COMMON_ERROR_NO_PERMISSIONS");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();
			// const { language, locale, shortNumber, allowedRoles, counters, digits } =
			// 	guildSettings;
			let logsSection: string[] | [] = [];
			const latestLogs = await guildSettings.getLatestLogs(100);

			if (latestLogs.length > 0) {
				const formatedLatestLogs = latestLogs
					.map(
						({ timestamp, text }) =>
							`[${timestamp.toLocaleString(
								guildSettings.locale ?? "en-US"
							)}] ${text}\n`
					)
					.join("");

				logsSection = safeDiscordString(formatedLatestLogs).map(
					(portion) => "```" + portion + "```"
				);
			}
			if (logsSection.length > 0) {
				const guildLogsText = await txt(
					"COMMAND_SETTINGS_LOGS_GUILD_LOGS_TEXT",
					{
						SERVER_NAME: command.guild.name,
						SERVER_ID: inlineCode(command.guild.id)
					}
				);
				const embedPages = [
					...(logsSection as string[]).map((text) => {
						return new BaseMessageEmbed()
							.setTitle(`**${guildLogsText}**`)
							.setDescription(text);
					})
				];
				new Paginator(command, embedPages).displayPage(0);
			} else {
				const embed = new BaseMessageEmbed().setTitle(
					await txt("COMMAND_SETTINGS_LOGS_NO_LOGS", {
						SERVER_NAME: command.guild.name,
						SERVER_ID: inlineCode(command.guild.id)
					})
				);
				command.reply({ embeds: [embed] });
			}
		}
	}
});
