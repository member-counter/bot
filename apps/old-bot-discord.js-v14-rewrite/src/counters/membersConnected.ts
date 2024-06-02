import { ChannelType, VoiceChannel } from "discord.js";

import Counter from "../typings/Counter";
const MembersConnectedCounter: Counter<
	"connectedMembers" | "membersConnected"
> = {
	aliases: ["connectedMembers", "membersConnected"],
	isPremium: true,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, args }) => {
		const targetChannels = args[0] ?? [];

		return guild.channels.cache
			.filter((channel) => channel.type === ChannelType.GuildVoice)
			.reduce((prev, current: VoiceChannel) => {
				if (targetChannels.length > 0 && !targetChannels.includes(current.id)) {
					return prev;
				} else {
					return prev + current.members.size;
				}
			}, 0);
	}
} as const;

export default MembersConnectedCounter;
