import {
	ActionRowBuilder,
	ButtonBuilder,
	codeBlock,
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
		.setDescription("untranslated")
		.setDMPermission(false)
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
						.setName("digits")
						.setDescription(
							'Specify the digits separated by a comma (1 1, 2 2, 3 3) or use the word "reset" to reset them'
						)
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
				title: t("commands.settings.subcommands.see.title", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				}),
				fields: [
					{
						name: t("commands.settings.subcommands.see.language.name"),
						value: guildSettings.language
							? t("langName")
							: t("commands.settings.subcommands.see.language.value", {
									CURRENT_LANGUAGE: t("langName")
							  })
					},
					{
						name: t("commands.settings.subcommands.see.shortNumber.name"),
						value: t("commands.settings.subcommands.see.shortNumber.value", {
							CURRENT_SHORT_NUMBER: guildSettings.shortNumber
								? t("common.yes")
								: t("common.no")
						})
					},
					{
						name: t("commands.settings.subcommands.see.customDigits.name"),
						value: t("commands.settings.subcommands.see.customDigits.value", {
							CURRENT_DIGIT: guildSettings.digits.join(" ")
						})
					}
				]
			});

			const componentRow = new ActionRowBuilder<ButtonBuilder>();

			componentRow.addComponents(
				new ButtonBuilder({
					style: ButtonStyle.Danger,
					label: t("commands.settings.buttons.deleteSettings"),
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
					.setLanguage(
						command.options
							.get("language", false)
							.value.toString() as typeof availableLocales[number]
					)
					.catch((e) => e);

				i18n = await i18nService(guildSettings.language ?? command.guildLocale);

				// eslint-disable-next-line prefer-destructuring
				t = i18n.t;

				embed.addFields([
					{
						name: t("commands.settings.subcommands.see.language.name"),
						value: error
							? t(error.message)
							: guildSettings.language
							? t("langName")
							: t("commands.settings.subcommands.see.language.value", {
									CURRENT_LANGUAGE: t("langName")
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
						name: t("commands.settings.subcommands.see.shortNumber.name"),
						value: error
							? t(error.message)
							: t("commands.settings.subcommands.see.shortNumber.value", {
									CURRENT_SHORT_NUMBER: guildSettings.shortNumber
										? t("common.yes")
										: t("common.no")
							  })
					}
				]);
			}
			if (command.options.get("digits", false)) {
				const content = command.options.get("digits").value as string;
				const userWantsToReset = content.split(/\s+/)[0] === "reset";

				if (userWantsToReset) {
					await guildSettings.resetDigits();
					descriptionParts.push(
						t(
							"commands.settings.subcommands.set.options.customDigits.resetSuccess"
						)
					);

					embed.addFields([
						{
							name: t("commands.settings.subcommands.see.customDigits.name"),
							value: t("commands.settings.subcommands.see.customDigits.value", {
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

						embed.addFields([
							{
								name: t("commands.settings.subcommands.see.customDigits.name"),
								value:
									errors.length > 0
										? (
												await Promise.all(
													errors.map(async (errMessage) => t(errMessage))
												)
										  ).join("\n")
										: guildSettings.digits.join(" ")
							}
						]);
					} else {
						throw new UserError(
							"commands.settings.subcommands.set.options.customDigits.errorMissingParams"
						);
					}
				}
			}
			// Summary
			embed.setTitle(
				t("commands.settings.subcommands.see.title", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				})
			);

			if (!embed.data.fields?.length) {
				descriptionParts.push(
					t("commands.settings.subcommands.set.noChangesMade")
				);
				embed.setDescription(descriptionParts.reverse().join("\n\n"));
			} else {
				descriptionParts.push(
					t("commands.settings.subcommands.set.changesMade")
				);
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
			guildSettings.log("Hello world!");
			await command.guild.fetch();

			let logsSection: string[] | [] = [];
			const latestLogs = await guildSettings.getLatestLogs(100);

			if (latestLogs.length > 0) {
				const formattedLatestLogs = latestLogs
					.map(
						({ timestamp, text }) =>
							`[${timestamp.toLocaleString(language ?? "en-US")}] ${text}\n`
					)
					.join("");

				logsSection = safeDiscordString(formattedLatestLogs).map((portion) =>
					codeBlock(portion)
				);
			}
			if (logsSection.length > 0) {
				const embedPages = [
					...(logsSection as string[]).map((text) => {
						return new BaseMessageEmbed()
							.setTitle(
								t("commands.settings.subcommands.logs.title.hasLogs", {
									SERVER_NAME: command.guild.name,
									SERVER_ID: inlineCode(command.guild.id)
								})
							)
							.setDescription(text);
					})
				];
				new Paginator(command, embedPages, true).displayPage(0);
			} else {
				const embed = new BaseMessageEmbed().setTitle(
					t("commands.settings.subcommands.logs.title.noLogs", {
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
			const success = t(
				"commands.settings.subcommands.classicPremiumUpgrade.success",
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
							"commands.settings.subcommands.classicPremiumUpgrade.errorCannotUpgrade"
						);
					}
					case "noUpgradesAvailable": {
						throw new UserError(
							"commands.settings.subcommands.classicPremiumUpgrade.noServerUpgradesAvailable"
						);
					}
					default:
						throw error;
				}
			}
		}
	}
});
