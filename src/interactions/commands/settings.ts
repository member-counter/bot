import {
	ActionRowBuilder,
	ButtonBuilder,
	codeBlock,
	inlineCode,
	SlashCommandBuilder
} from "@discordjs/builders";
import { APIEmbedField, ButtonStyle, PermissionsBitField } from "discord.js";

import config from "../../config";
import GuildSettings from "../../services/GuildSettings";
import { availableLocales, i18nService } from "../../services/i18n";
import { Command } from "../../structures";
import {
	BaseMessageEmbed,
	getBotInviteLink,
	Paginator,
	safeDiscordString,
	UserError
} from "../../utils";
import { Unwrap } from "../../utils";
import { buttonId as resetGuildSettingsButtonId } from "../buttons/resetGuildSettings";

interface SeeFields {
	[key: string]: (
		guildSettings: GuildSettings,
		i18n: Unwrap<typeof i18nService>
	) => Promise<APIEmbedField>;
}

const seeFields: SeeFields = {
	language: async (guildSettings, { t }) => {
		return {
			name: t("commands.settings.subcommands.see.language.name"),
			value: guildSettings.language
				? t("langName")
				: t("commands.settings.subcommands.see.language.fromServerLanguage", {
						CURRENT_DISCORD_LANGUAGE: t("langName")
				  })
		};
	},
	locale: async (guildSettings, { t }) => {
		return {
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
				: t("commands.settings.subcommands.see.locale.fromSettingsLanguage", {
						CURRENT_SETTINGS_LANGUAGE: t("langName")
				  })
		};
	},
	shortNumber: async (guildSettings, { t }) => {
		return {
			name: t("commands.settings.subcommands.see.shortNumber.name"),
			value: guildSettings.shortNumber ? t("common.yes") : t("common.no")
		};
	},
	customDigits: async (guildSettings, { t }) => {
		return {
			name: t("commands.settings.subcommands.see.customDigits.name"),
			value: guildSettings.digits.join(" ")
		};
	}
};

export const settingsCommand = new Command<"settings">({
	name: "settings",
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
		see: async (command, i18n) => {
			const { t } = i18n;
			if (!command.inGuild()) throw new UserError(t("common.error.noDm"));
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError(t("common.error.noPermissions"));

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();

			const embed = new BaseMessageEmbed({
				title: t("commands.settings.subcommands.see.title", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				}),
				fields: [
					await seeFields.language(guildSettings, i18n),
					await seeFields.locale(guildSettings, i18n),
					await seeFields.shortNumber(guildSettings, i18n),
					await seeFields.customDigits(guildSettings, i18n)
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
			if (!command.inGuild()) throw new UserError(t("common.error.noDm"));
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError(t("common.error.noPermissions"));

			const guildSettings = await GuildSettings.init(command.guildId);
			await command.guild.fetch();
			const embed = new BaseMessageEmbed();
			const descriptionParts: string[] = [];
			const language = command.options.getString("language", false);
			const locale = command.options.getString("locale", false);
			const shortNumber = command.options.getBoolean("short-number", false);
			const digits = command.options.getString("digits", false);
			// Language (handle it ASAP before using t)
			if (language) {
				await guildSettings.setLanguage(language);

				i18n = await i18nService(guildSettings.language ?? command.guildLocale);

				({ t } = i18n);

				embed.addFields(await seeFields.language(guildSettings, i18n));
			}

			if (locale) {
				await guildSettings.setLocale(locale);

				embed.addFields(await seeFields.locale(guildSettings, i18n));
			}

			if (shortNumber) {
				await guildSettings.setShortNumber(shortNumber);

				embed.addFields(await seeFields.shortNumber(guildSettings, i18n));
			}

			if (digits) {
				const userWantsToReset = digits.split(/\s+/)[0] === "reset";

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
							value: guildSettings.digits.join(" ")
						}
					]);
				} else {
					const digitsToSet = (() => {
						return digits
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

					embed.addFields(await seeFields.customDigits(guildSettings, i18n));
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
			if (!command.inGuild()) throw new UserError(t("common.error.noDm"));
			if (
				!command.memberPermissions.has(PermissionsBitField.Flags.Administrator)
			)
				throw new UserError(t("common.error.noPermissions"));

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
			if (!command.inGuild()) throw new UserError(t("common.error.noDm"));

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
