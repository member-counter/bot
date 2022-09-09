import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonInteraction, ButtonStyle } from "discord.js";

import GuildSettings from "../../services/GuildSettings";
import { i18n } from "../../services/i18n";

export const buttonId = "reset_guild_settings";

export const resetGuildSettings = async (
	buttonInteraction: ButtonInteraction
) => {
	const [name, confirm] = buttonInteraction.customId.split(":");

	if (name !== buttonId) return;
	if (!buttonInteraction.inGuild()) return;

	const { txt } = await i18n(buttonInteraction);

	if (confirm) {
		const guildSettings = await GuildSettings.init(buttonInteraction.guildId);
		await guildSettings.resetSettings();

		await buttonInteraction.reply({
			content: await txt("BUTTON_RESET_SETTINGS_DONE"),
			ephemeral: true
		});
	} else {
		const componentRow = new ActionRowBuilder<ButtonBuilder>();

		componentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Danger,
				label: await txt("COMMAND_SETTINGS_BUTTON_DELETE_ALL"),
				custom_id: `${buttonId}:true`,
				emoji: { name: "🗑" }
			})
		);

		await buttonInteraction.reply({
			components: [componentRow],
			content: await txt("BUTTON_RESET_SETTINGS_CONFIRM"),
			ephemeral: true
		});
	}
};
