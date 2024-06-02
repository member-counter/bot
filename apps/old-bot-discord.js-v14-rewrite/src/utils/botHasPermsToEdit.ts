import { GuildChannel, PermissionFlagsBits } from "discord.js";
import { bot } from "..";
import { ChannelType } from "discord-api-types/v10";

const botHasPermsToEdit = (channel: GuildChannel): boolean => {
	const botPermsInChannel = channel.permissionsFor(bot.client.user.id);

	const botCanManage = botPermsInChannel.has(
		PermissionFlagsBits.ManageChannels
	);

	const botCanRead =
		channel.type === ChannelType.GuildText ||
		channel.type === ChannelType.GuildCategory ||
		channel.type === ChannelType.GuildAnnouncement
			? botPermsInChannel.has(PermissionFlagsBits.ReadMessageHistory)
			: true;

	const botCanConnect =
		channel.type === ChannelType.GuildVoice
			? botPermsInChannel.has(PermissionFlagsBits.Connect)
			: true;

	return botCanManage && botCanRead && botCanConnect;
};

export default botHasPermsToEdit;
