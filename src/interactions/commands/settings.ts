import {
	ActionRowBuilder,
	ButtonBuilder,
	inlineCode,
	SlashCommandBuilder
} from "@discordjs/builders";
import { ButtonStyle, PermissionsBitField } from "discord.js";

import config from "../../config";
import GuildSettings from "../../services/GuildSettings";
import { i18n } from "../../services/i18n";
import { Command } from "../../structures";
import BaseMessageEmbed from "../../utils/BaseMessageEmbed";
import getBotInviteLink from "../../utils/getBotInviteLink";
import Paginator from "../../utils/Paginator";
import safeDiscordString from "../../utils/safeDiscordString";
import { UserError } from "../../utils/UserError";
import { buttonId as resetGuildSettingsButtonId } from "../buttons/resetGuildSettings";

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
				.addBooleanOption((option) =>
					option
						.setName("short-number")
						.setDescription(
							"This command allows you to show a count in a compact form in counters"
						)
				)
				.addStringOption((option) =>
					option
						.setName("digit")
						.setDescription("Used to set or reset the digits")
						.setDescriptionLocalizations({
							"en-US": "Used to set or reset the digits",
							de: "Wird verwendet, um die Ziffern einzustellen oder zurückzusetzen"
						})
				)
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("logs")
				.setDescription("See the bot logs for more information")
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("classic-premium-upgrade")
				.setDescription(
					"Used to upgrade the server to classic premium (Member Counter Premium)."
				)
		),
	execute: {
		see: async (command, { txt }) => {
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
					},
					{
						name: await txt("COMMAND_SETTINGS_SEE_SHORT_NUMBER"),
						value: await txt(
							"COMMAND_SETTINGS_SEE_SHORT_NUMBER_DEFAULT_VALUE",
							{
								CURRENT_SHORT_NUMBER: guildSettings.shortNumber
									? await txt("COMMON_YES")
									: await txt("COMMON_NO")
							}
						)
					},
					{
						name: await txt("COMMAND_SETTINGS_SEE_DIGIT"),
						value: await txt("COMMAND_SETTINGS_SEE_DIGIT_DEFAULT_VALUE", {
							CURRENT_DIGIT: guildSettings.digits.join(" ")
						})
					}
				]
			});

			const componentRow = new ActionRowBuilder<ButtonBuilder>();

			componentRow.addComponents(
				new ButtonBuilder({
					style: ButtonStyle.Danger,
					label: await txt("COMMAND_SETTINGS_BUTTON_DELETE_ALL"),
					custom_id: resetGuildSettingsButtonId,
					emoji: { name: "🗑" }
				})
			);

			await command.reply({
				embeds: [embed],
				components: [componentRow],
				ephemeral: false
			});
		},
		set: async (command, { txt }) => {
			if (!command.inGuild()) throw new UserError("COMMON_ERROR_NO_DM");
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError("COMMON_ERROR_NO_PERMISSIONS");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();
			const embed = new BaseMessageEmbed();
			const descriptionParts: string[] = [];
			// Language (handle it ASAP before using txt)
			if (command.options.get("language", false)) {
				const error = await guildSettings
					.setLocale(command.options.get("language", false).value.toString())
					.catch((e) => e);
				const { txt: i18nTxt } = await i18n(
					guildSettings.locale ?? command.guildLocale
				);
				txt = i18nTxt;

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
			if (command.options.get("short-number", false)) {
				const error = await guildSettings
					.setShortNumber(command.options.get("short-number").value as boolean)
					.catch((e) => e);
				const { txt: i18nTxt } = await i18n(
					guildSettings.locale ?? command.guildLocale
				);
				txt = i18nTxt;
				embed.addFields([
					{
						name: await txt("COMMAND_SETTINGS_SEE_SHORT_NUMBER"),
						value: error?.message
							? await txt(error?.message)
							: await txt("COMMAND_SETTINGS_SEE_SHORT_NUMBER_DEFAULT_VALUE", {
									CURRENT_SHORT_NUMBER: guildSettings.shortNumber
										? await txt("COMMON_YES")
										: await txt("COMMON_NO")
							  })
					}
				]);
			}
			if (command.options.get("digit", false)) {
				const { txt: i18nTxt } = await i18n(
					guildSettings.locale ?? command.guildLocale
				);
				txt = i18nTxt;
				const content = command.options.get("digit").value as string;
				const userWantsToReset = content.split(/\s+/)[0] === "reset";
				if (userWantsToReset) {
					await guildSettings.resetDigits();
					descriptionParts.push(
						await txt("COMMAND_SETTINGS_SET_DIGIT_RESET_SUCCESS")
					);

					embed.addFields([
						{
							name: await txt("COMMAND_SETTINGS_SEE_DIGIT"),
							value: await txt("COMMAND_SETTINGS_SEE_DIGIT_DEFAULT_VALUE", {
								CURRENT_DIGIT: guildSettings.digits.join(" ")
							})
						}
					]);
				} else {
					const digitsToSet = (() => {
						return content
							.split(",")
							.map((set) => set.trim())
							.map((set) => set.split(/\s+/))
							.map((set) => {
								if (!isNaN(parseInt(set[0], 10)) && set[1]) {
									return {
										digit: parseInt(set[0], 10),
										value: set[1]
									};
								} else {
									return null;
								}
							})
							.filter((digit) => digit !== null);
					})();

					if (digitsToSet.length > 0) {
						const errors = [];
						for (const digitToSet of digitsToSet) {
							const error = await guildSettings
								.setDigit(digitToSet.digit, digitToSet.value)
								.catch((e) => e);
							if (error?.message) errors.push(error?.message);
						}
						descriptionParts.push(
							await txt("COMMAND_SETTINGS_SET_DIGIT_SUCCESS")
						);
						embed.addFields([
							{
								name: await txt("COMMAND_SETTINGS_SEE_DIGIT"),
								value:
									errors.length > 0
										? (
												await Promise.all(
													errors.map(
														async (errMessage) => await txt(errMessage)
													)
												)
										  ).join("\n")
										: await txt("COMMAND_SETTINGS_SEE_DIGIT_DEFAULT_VALUE", {
												CURRENT_DIGIT: guildSettings.digits.join(" ")
										  })
							}
						]);
					} else {
						throw new UserError(
							"COMMAND_SETTINGS_SET_DIGIT_ERROR_MISSING_PARAMS"
						);
					}
				}
			}
			// Summary
			embed.setTitle(
				await txt("COMMAND_SETTINGS_SEE_TITLE", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				})
			);

			if (!embed.data.fields?.length) {
				descriptionParts.push(
					await txt("COMMAND_SETTINGS_SET_NO_CHANGES_MADE")
				);
				embed.setDescription(descriptionParts.reverse().join("\n\n"));
			} else {
				descriptionParts.push(await txt("COMMAND_SETTINGS_SET_CHANGES_MADE"));
				embed.setDescription(descriptionParts.reverse().join("\n\n"));
			}

			await command.reply({
				embeds: [embed],
				ephemeral: false
			});
		},
		logs: async (command, { txt, locale }) => {
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
				const formattedLatestLogs = latestLogs
					.map(
						({ timestamp, text }) =>
							`[${timestamp.toLocaleString(locale ?? "en-US")}] ${text}\n`
					)
					.join("");

				logsSection = safeDiscordString(formattedLatestLogs).map(
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
				new Paginator(command, embedPages, true).displayPage(0);
			} else {
				const embed = new BaseMessageEmbed().setTitle(
					await txt("COMMAND_SETTINGS_LOGS_NO_LOGS", {
						SERVER_NAME: command.guild.name,
						SERVER_ID: inlineCode(command.guild.id)
					})
				);
				command.reply({ embeds: [embed], ephemeral: false });
			}
		},
		"classic-premium-upgrade": async (command, { txt }) => {
			if (!command.inGuild()) throw new UserError("COMMON_ERROR_NO_DM");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();
			const success = await txt(
				"COMMAND_SETTINGS_CLASSIC_PREMIUM_UPGRADE_SUCCESS",
				{
					BOT_LINK: getBotInviteLink(
						command.guildId,
						config.premium.premiumBotId
					)
				}
			);
			try {
				await guildSettings.upgradeServer(command.member.user.id);
				command.reply({ content: success, ephemeral: true });
			} catch (error) {
				switch (error.message) {
					case "alreadyUpgraded": {
						throw new UserError(
							"COMMAND_SETTINGS_CLASSIC_PREMIUM_UPGRADE_ERROR_CANNOT_UPGRADE"
						);
					}
					case "noUpgradesAvailable": {
						throw new UserError(
							"COMMAND_SETTINGS_CLASSIC_PREMIUM_UPGRADE_NO_SERVER_UPGRADES_AVAILABLE"
						);
					}
					default:
						throw error;
						break;
				}
			}
		}
	}
});
