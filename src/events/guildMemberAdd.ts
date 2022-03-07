import getEnv from "../utils/getEnv";
import Eris from "eris";
import GuildService from "../services/GuildService";

const { PREMIUM_BOT_ID, PREMIUM_BOT } = getEnv();

const guildMemberAdd = async (guild: Eris.Guild, member: Eris.Member) => {
	// Apply new permissions for the premium bot when it joins
	if (!PREMIUM_BOT && member.id === PREMIUM_BOT_ID) {
		const guildSettings = await GuildService.init(guild.id);

		if (guildSettings.premium) {
			console.log(
				`Premium Bot joined in a premium guild, ${guild.name} (${guild.id}), applying permissions for the enabled channels`
			);
			for (const [channelId] of guildSettings.counters) {
				if (guild.channels.has(channelId)) {
					const channel = guild.channels.get(channelId);

					await channel
						.editPermission(
							PREMIUM_BOT_ID,
							Eris.Constants.Permissions.voiceConnect |
								Eris.Constants.Permissions.viewChannel,
							0,
							// TODO use constants when abalabahaha/eris#1271 is merged
							1
						)
						.catch(console.error);
				}
			}
			guild.leave().catch(console.error);
		}
	}
};

export default guildMemberAdd;
