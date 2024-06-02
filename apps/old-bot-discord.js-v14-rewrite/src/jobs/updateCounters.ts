import CountService from "../services/CountService";
import GuildSettings from "../services/GuildSettings";
import Job from "../typings/Job";
import config from "../config";
import logger from "../logger";

const {
	discord: {
		bot: { counterUpdateInterval }
	}
} = config;

const guildsBeingUpdated: Set<string> = new Set();

const updateCounters: Job = {
	time: counterUpdateInterval,
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		client.guilds.cache.forEach(async (guild) => {
			if (guildsBeingUpdated.has(guild.id)) return;
			try {
				guildsBeingUpdated.add(guild.id);
				const guildSettings = await GuildSettings.init(guild.id);
				const guildCounts = await CountService.init(
					guild,
					guildSettings.locale
				);
				await guildCounts.updateCounters();
			} catch (error) {
				logger.error(error);
			} finally {
				guildsBeingUpdated.delete(guild.id);
			}
		});
	}
};

export default updateCounters;
