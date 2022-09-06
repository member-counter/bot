import { inlineCode, SlashCommandBuilder } from "@discordjs/builders";
import { Constants, MessageActionRow, MessageButton } from "discord.js";
import GuildSettings from "../../services/GuildSettings";
import { i18n } from "../../services/i18n";
import { Command } from "../../structures";
import BaseMessageEmbed from "../../utils/BaseMessageEmbed";
import { UserError } from "../../utils/UserError";

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
		),
	execute: {
		see: async (command, txt) => {
			if (!command.inGuild()) throw new UserError("COMMON_ERROR_NO_DM");
			if (!command.memberPermissions.has("ADMINISTRATOR"))
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

			const compoenentRow = new MessageActionRow();

			compoenentRow.addComponents(
				new MessageButton({
					style: Constants.MessageButtonStyles.DANGER,
					label: await txt("COMMAND_SETTINGS_BUTTON_DELETE_ALL"),
					customId: "dgs",
					emoji: "🗑"
				})
			);

			await command.reply({
				embeds: [embed],
				components: [compoenentRow],
				ephemeral: true
			});
		},
		set: async (command, txt) => {
			if (!command.inGuild()) throw new UserError("COMMON_ERROR_NO_DM");
			if (!command.memberPermissions.has("ADMINISTRATOR"))
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

				embed.addField(
					await txt("COMMAND_SETTINGS_SEE_LANGUAGE"),
					error?.message
						? await txt(error?.message)
						: guildSettings.locale
						? await txt("LANG_NAME")
						: await txt("COMMAND_SETTINGS_SEE_LANGUAGE_DEFAULT_VALUE", {
								CURRENT_LANGUAGE: await txt("LANG_NAME")
						  })
				);
			}

			// Summary
			embed.setTitle(
				await txt("COMMAND_SETTINGS_SEE_TITLE", {
					SERVER_NAME: command.guild.name,
					SERVER_ID: inlineCode(command.guild.id)
				})
			);

			if (!embed.fields.length) {
				embed.setDescription(await txt("COMMAND_SETTINGS_SET_NO_CHANGES_MADE"));
			} else {
				embed.setDescription(await txt("COMMAND_SETTINGS_SET_CHANGES_MADE"));
			}

			await command.reply({
				embeds: [embed],
				ephemeral: true
			});
		}
	}
});
