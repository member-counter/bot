import Eris from "eris";
import GuildService from "../services/GuildService";

const channelDelete = async (channel: Eris.AnyChannel) => {
	if (channel instanceof Eris.GuildChannel) {
		const guildSettings = await GuildService.init(channel.guild.id);

		await guildSettings.deleteCounter(channel.id);
	}
};

export default channelDelete;
