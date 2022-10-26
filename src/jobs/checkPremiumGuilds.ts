import logger from "../logger";
import GuildSettings from "../services/GuildSettings";
import Job from "../typings/Job";
import config from "../config";

const {
	premium: { thisBotIsPremium },
	unrestrictedMode
} = config;

const checkPremiumGuilds: Job = {
	time: "0 0 */1 * * *",
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		if (thisBotIsPremium && !unrestrictedMode) {
			client.guilds.cache.forEach(async (guild) => {
				const guildSettings = await GuildSettings.init(guild.id);
				if (!guildSettings.premium) guild.leave().catch(logger.error);
			});
		}
	}
};

export default checkPremiumGuilds;
