import { SlashCommandBuilder } from "@discordjs/builders";
import { Constants, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../structures";
import BaseMessageEmbed from "../../utils/BaseMessageEmbed";
import getBotInviteLink from "../../utils/getBotInviteLink";
import { twemojiURL } from "../../utils/twemojiURL";
import { UserError } from "../../utils/UserError";

export const inviteCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Gives you an invite link to add the bot"),
	execute: async (command, txt) => {
		const embed = new BaseMessageEmbed();

		embed.setDescription(await txt("COMMAND_INVITE_DESCRIPTION", { INVITE_URL: getBotInviteLink() }))

		embed.setThumbnail(twemojiURL("🤖"));

		const componentRow = new MessageActionRow();
		componentRow.addComponents(
			new MessageButton({
				style: Constants.MessageButtonStyles.LINK,
				url: getBotInviteLink(),
				label: await txt("COMMAND_INVITE_ADD_TO_SERVER")
			})
		);

		if (command.inGuild()) {
			componentRow.addComponents(
				new MessageButton({
					style: Constants.MessageButtonStyles.LINK,
					url: getBotInviteLink(command.guildId),
					label: await txt("COMMAND_INVITE_ADD_TO_SERVER_AGAIN")
				})
			);
		}

		await command.reply({
			embeds: [embed],
			components: [componentRow],
			ephemeral: true
		});
	}
});
