import Counter from "../typings/Counter";
import Eris from "eris";

const MembersConnectedCounter: Counter = {
	aliases: ["connectedMembers", "membersConnected"],
	isPremium: true,
	isEnabled: false,
	lifetime: 0,
	execute: async ({ guild, args }) => {
		const targetChannels = args[0] ?? [];

		return guild.channels
			.filter(
				(channel) => channel.type === Eris.Constants.ChannelTypes.GUILD_VOICE
			)
			.reduce((prev, current: Eris.VoiceChannel) => {
				if (targetChannels.length > 0 && !targetChannels.includes(current.id)) {
					return prev;
				} else {
					return prev + current.voiceMembers.size;
				}
			}, 0);
	}
};

export default MembersConnectedCounter;
