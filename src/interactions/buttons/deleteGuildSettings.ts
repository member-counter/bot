import {
	ButtonInteraction,
	Constants,
	MessageActionRow,
	MessageButton
} from "discord.js";
import GuildSettings from "../../services/GuildSettings";
import { i18n } from "../../services/i18n";

export const deleteGuildSettings = async (
	buttonInteraction: ButtonInteraction
) => {
	if (!buttonInteraction.inGuild()) return;
	if (!buttonInteraction.customId.startsWith("dgs")) return;

	const [name, confirm] = buttonInteraction.customId.split(":");

	const txt = await i18n(buttonInteraction);

	if (Boolean(confirm)) {
		const guildSettings = await GuildSettings.init(buttonInteraction.guildId);
		await guildSettings.delete();

		await buttonInteraction.reply({
			content: await txt("BUTTON_DELETE_SETTINGS_DONE")
		});
	} else {
		const compoenentRow = new MessageActionRow();

		compoenentRow.addComponents(
			new MessageButton({
				style: Constants.MessageButtonStyles.DANGER,
				label: await txt("COMMAND_SETTINGS_BUTTON_DELETE_ALL"),
				customId: "dgs:true",
				emoji: "🗑"
			})
		);

		await buttonInteraction.reply({
			components: [compoenentRow],
			content: await txt("BUTTON_DELETE_SETTINGS_CONFIRM")
		});
	}
};
