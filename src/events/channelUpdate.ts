import Eris from "eris";
import updateTemplateContent from "../utils/updateTemplateContentChannelEvent";

const channelUpdate = (channel: Eris.AnyChannel, oldChannel: Eris.OldGuildChannel | Eris.OldGuildTextChannel | Eris.OldGuildVoiceChannel | Eris.OldGroupChannel) => {
	if (channel instanceof Eris.GuildChannel) {
		updateTemplateContent(channel);
	}
};

export default channelUpdate;
