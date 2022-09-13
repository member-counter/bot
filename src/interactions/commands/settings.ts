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
import { availableLocales, i18nService } from "../../services/i18n";
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
				.addStringOption((option) =>
					option
						.setName("locale")
						.setDescription(
							"Changes how counters are formatted, defaults to language"
						)
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
							: t(
									"commands.settings.subcommands.see.language.fromServerLanguage",
									{
										CURRENT_DISCORD_LANGUAGE: t("langName")
									}
							  )
					},
					{
						name: t("commands.settings.subcommands.see.locale.name"),
						value: guildSettings.locale
							? availableLocales.includes(guildSettings.locale as any)
								? await (async () => {
										const i18nLocale = await i18nService(guildSettings.locale);
										return t(
											"commands.settings.subcommands.see.locale.fromAvailableLanguages",
											{
												LANG_NAME: i18nLocale.t("langName"),
												LANG_CODE: i18nLocale.t("langCode")
											}
										);
								  })()
								: t("commands.settings.subcommands.see.locale.custom", {
										CURRENT: guildSettings.locale
								  })
							: t(
									"commands.settings.subcommands.see.locale.fromSettingsLanguage",
									{
										CURRENT_SETTINGS_LANGUAGE: t("langName")
									}
							  )
					},
					{
						name: t("commands.settings.subcommands.see.shortNumber.name"),
						value: guildSettings.shortNumber ? t("common.yes") : t("common.no")
					},
					{
						name: t("commands.settings.subcommands.see.customDigits.name"),
						value: guildSettings.digits.join(" ")
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
				await guildSettings.setLanguage(
					command.options.get("language", false).value.toString()
				);

				i18n = await i18nService(guildSettings.language ?? command.guildLocale);

				// eslint-disable-next-line prefer-destructuring
				t = i18n.t;

				embed.addFields([
					{
						name: t("commands.settings.subcommands.see.language.name"),
						value: guildSettings.language
							? t("langName")
							: t(
									"commands.settings.subcommands.see.language.fromServerLanguage",
									{
										CURRENT_DISCORD_LANGUAGE: t("langName")
									}
							  )
					}
				]);
			}
			if (command.options.get("locale", false)) {
				await guildSettings.setLocale(
					command.options.get("locale", false).value.toString()
				);

				embed.addFields([
					{
						name: t("commands.settings.subcommands.see.locale.name"),
						value: guildSettings.locale
							? await (async () => {
									const i18nLocale = await i18nService(guildSettings.locale);
									return t(
										"commands.settings.subcommands.see.locale.fromAvailableLanguages",
										{
											LANG_NAME: i18nLocale.t("langName"),
											LANG_CODE: i18nLocale.t("langCode")
										}
									);
							  })()
							: t(
									"commands.settings.subcommands.see.locale.fromServerLanguage",
									{
										CURRENT_DISCORD_LANGUAGE: t("langName")
									}
							  )
					}
				]);
			}
			if (command.options.get("short-number", false)) {
				await guildSettings.setShortNumber(
					command.options.get("short-number").value as boolean
				);

				embed.addFields([
					{
						name: t("commands.settings.subcommands.see.shortNumber.name"),
						value: t("commands.settings.subcommands.see.shortNumber.value", {
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
							.filter((digit) => digit.length)
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

					for (const digitToSet of digitsToSet) {
						await guildSettings.setDigit(digitToSet.digit, digitToSet.value);
					}

					embed.addFields([
						{
							name: t("commands.settings.subcommands.see.customDigits.name"),
							value: guildSettings.digits.join(" ")
						}
					]);
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
							`[${timestamp.toLocaleString(language)}] ${text}\n`
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
