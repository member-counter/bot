import { ButtonInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord-api-types/payloads";
import GuildSettings from "../../services/GuildSettings";
import { i18n } from "../../services/i18n";

export const deleteGuildSettings = async (
	buttonInteraction: ButtonInteraction
) => {
	if (!buttonInteraction.inGuild()) return;
	if (!buttonInteraction.customId.startsWith("dgs")) return;

	const [, confirm] = buttonInteraction.customId.split(":");

	const txt = await i18n(buttonInteraction);

	if (confirm) {
		const guildSettings = await GuildSettings.init(buttonInteraction.guildId);
		await guildSettings.delete();

		await buttonInteraction.reply({
			content: await txt("BUTTON_DELETE_SETTINGS_DONE")
		});
	} else {
		const compoenentRow = new ActionRowBuilder<ButtonBuilder>();

		compoenentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Danger,
				label: await txt("COMMAND_SETTINGS_BUTTON_DELETE_ALL"),
				custom_id: "dgs:true",
				emoji: { name: "🗑" }
			})
		);

		await buttonInteraction.reply({
			components: [compoenentRow],
			content: await txt("BUTTON_DELETE_SETTINGS_CONFIRM")
		});
	}
};
