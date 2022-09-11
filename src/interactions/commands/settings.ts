import {
	ActionRowBuilder,
	ButtonBuilder,
	inlineCode,
	SlashCommandBuilder
} from "@discordjs/builders";
import { ButtonStyle, PermissionsBitField } from "discord.js";
import config from "../../config";
import GuildSettings from "../../services/GuildSettings";
import { availableLocales, i18n as i18nService } from "../../services/i18n";
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
		see: async (command, { t }) => {
			if (!command.inGuild()) throw new UserError("common.error.noDm");
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError("common.error.noPermissions");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();

			const embed = new BaseMessageEmbed({
				title: t("COMMAND_SETTINGS_SEE_TITLE", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				}),
				fields: [
					{
						name: t("COMMAND_SETTINGS_SEE_LANGUAGE"),
						value: guildSettings.locale
							? t("LANG_NAME")
							: t("COMMAND_SETTINGS_SEE_LANGUAGE_DEFAULT_VALUE", {
									CURRENT_LANGUAGE: t("LANG_NAME")
							  })
					},
					{
						name: t("COMMAND_SETTINGS_SEE_SHORT_NUMBER"),
						value: t("COMMAND_SETTINGS_SEE_SHORT_NUMBER_DEFAULT_VALUE", {
							CURRENT_SHORT_NUMBER: guildSettings.shortNumber
								? t("common.yes")
								: t("common.no")
						})
					},
					{
						name: t("COMMAND_SETTINGS_SEE_DIGIT"),
						value: t("COMMAND_SETTINGS_SEE_DIGIT_DEFAULT_VALUE", {
							CURRENT_DIGIT: guildSettings.digits.join(" ")
						})
					}
				]
			});

			const componentRow = new ActionRowBuilder<ButtonBuilder>();

			componentRow.addComponents(
				new ButtonBuilder({
					style: ButtonStyle.Danger,
					label: t("COMMAND_SETTINGS_BUTTON_DELETE_ALL"),
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
		set: async (command, i18n) => {
			let { t } = i18n;
			if (!command.inGuild()) throw new UserError("common.error.noDm");
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError("common.error.noPermissions");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();
			const embed = new BaseMessageEmbed();
			const descriptionParts: string[] = [];

			// Language (handle it ASAP before using t)
			if (command.options.get("language", false)) {
				const error = await guildSettings
					.setLocale(
						command.options
							.get("language", false)
							.value.toString() as typeof availableLocales[number]
					)
					.catch((e) => e);

				i18n = await i18nService(guildSettings.locale ?? command.guildLocale);

				// eslint-disable-next-line prefer-destructuring
				t = i18n.t;

				embed.addFields([
					{
						name: t("COMMAND_SETTINGS_SEE_LANGUAGE"),
						value: error.message
							? t(error.message)
							: guildSettings.locale
							? t("LANG_NAME")
							: t("COMMAND_SETTINGS_SEE_LANGUAGE_DEFAULT_VALUE", {
									CURRENT_LANGUAGE: t("LANG_NAME")
							  })
					}
				]);
			}
			if (command.options.get("short-number", false)) {
				const error = await guildSettings
					.setShortNumber(command.options.get("short-number").value as boolean)
					.catch((e) => e);

				embed.addFields([
					{
						name: t("COMMAND_SETTINGS_SEE_SHORT_NUMBER"),
						value: error?.message
							? t(error?.message)
							: t("COMMAND_SETTINGS_SEE_SHORT_NUMBER_DEFAULT_VALUE", {
									CURRENT_SHORT_NUMBER: guildSettings.shortNumber
										? t("common.yes")
										: t("common.no")
							  })
					}
				]);
			}
			if (command.options.get("digit", false)) {
				const content = command.options.get("digit").value as string;
				const userWantsToReset = content.split(/\s+/)[0] === "reset";

				if (userWantsToReset) {
					await guildSettings.resetDigits();
					descriptionParts.push(t("COMMAND_SETTINGS_SET_DIGIT_RESET_SUCCESS"));

					embed.addFields([
						{
							name: t("COMMAND_SETTINGS_SEE_DIGIT"),
							value: t("COMMAND_SETTINGS_SEE_DIGIT_DEFAULT_VALUE", {
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
						descriptionParts.push(t("COMMAND_SETTINGS_SET_DIGIT_SUCCESS"));
						embed.addFields([
							{
								name: t("COMMAND_SETTINGS_SEE_DIGIT"),
								value:
									errors.length > 0
										? (
												await Promise.all(
													errors.map(async (errMessage) => t(errMessage))
												)
										  ).join("\n")
										: t("COMMAND_SETTINGS_SEE_DIGIT_DEFAULT_VALUE", {
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
				t("COMMAND_SETTINGS_SEE_TITLE", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				})
			);

			if (!embed.data.fields?.length) {
				descriptionParts.push(t("COMMAND_SETTINGS_SET_NO_CHANGES_MADE"));
				embed.setDescription(descriptionParts.reverse().join("\n\n"));
			} else {
				descriptionParts.push(t("COMMAND_SETTINGS_SET_CHANGES_MADE"));
				embed.setDescription(descriptionParts.reverse().join("\n\n"));
			}

			await command.reply({
				embeds: [embed],
				ephemeral: false
			});
		},
		logs: async (command, { t, language }) => {
			if (!command.inGuild()) throw new UserError("common.error.noDm");
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError("common.error.noPermissions");

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
							`[${timestamp.toLocaleString(language ?? "en-US")}] ${text}\n`
					)
					.join("");

				logsSection = safeDiscordString(formattedLatestLogs).map(
					(portion) => "```" + portion + "```"
				);
			}
			if (logsSection.length > 0) {
				const guildLogsText = t("COMMAND_SETTINGS_LOGS_GUILD_LOGS_TEXT", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				});
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
					t("COMMAND_SETTINGS_LOGS_NO_LOGS", {
						SERVER_NAME: command.guild.name,
						SERVER_ID: inlineCode(command.guild.id)
					})
				);
				command.reply({ embeds: [embed], ephemeral: false });
			}
		},
		"classic-premium-upgrade": async (command, { t }) => {
			if (!command.inGuild()) throw new UserError("common.error.noDm");

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();
			const success = t("COMMAND_SETTINGS_CLASSIC_PREMIUM_UPGRADE_SUCCESS", {
				BOT_LINK: getBotInviteLink(command.guildId, config.premium.premiumBotId)
			});
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
