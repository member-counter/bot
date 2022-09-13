import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonInteraction, ButtonStyle } from "discord.js";

import GuildSettings from "../../services/GuildSettings";
import { i18nService } from "../../services/i18n";

export const buttonId = "reset_guild_settings";

export const resetGuildSettings = async (
	buttonInteraction: ButtonInteraction
) => {
	const [name, confirm] = buttonInteraction.customId.split(":");

	if (name !== buttonId) return;
	if (!buttonInteraction.inGuild()) return;

	const { t } = await i18nService(buttonInteraction);

	if (confirm) {
		const guildSettings = await GuildSettings.init(buttonInteraction.guildId);
		await guildSettings.resetSettings();

		await buttonInteraction.reply({
			content: t("commands.settings.buttons.deleteSettingsDone"),
			ephemeral: true
		});
	} else {
		const componentRow = new ActionRowBuilder<ButtonBuilder>();

		componentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Danger,
				label: t("commands.settings.buttons.deleteSettings"),
				custom_id: `${buttonId}:true`,
				emoji: { name: "🗑" }
			})
		);

		await buttonInteraction.reply({
			components: [componentRow],
			content: t("commands.settings.buttons.deleteSettingsConfirm"),
			ephemeral: true
		});
	}
};
