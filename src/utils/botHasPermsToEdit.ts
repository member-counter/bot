import { GuildChannel, Constants } from "eris";
import Bot from "../bot";

const botHasPermsToEdit = (channel: GuildChannel): boolean => {
	const botPermsInChannel = channel.permissionsOf(Bot.client.user.id);

	const botCanManage = botPermsInChannel.has("manageChannels");

	const botCanRead =
		channel.type === Constants.ChannelTypes.GUILD_TEXT ||
		channel.type === Constants.ChannelTypes.GUILD_CATEGORY ||
		channel.type === Constants.ChannelTypes.GUILD_NEWS
			? botPermsInChannel.has("readMessages")
			: true;

	const botCanConnect =
		channel.type === Constants.ChannelTypes.GUILD_VOICE
			? botPermsInChannel.has("voiceConnect")
			: true;

	return botCanManage && botCanRead && botCanConnect;
};

export default botHasPermsToEdit;
