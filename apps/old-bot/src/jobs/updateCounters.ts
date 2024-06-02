import CountService from "../services/CountService";
import Job from "../typings/Job";
import getEnv from "../utils/getEnv";

const { UPDATE_COUNTER_INTERVAL } = getEnv();

const guildsBeingUpdated: Set<string> = new Set();

const updateCounters: Job = {
	time: UPDATE_COUNTER_INTERVAL,
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		client.guilds.forEach(async (guild) => {
			if (guildsBeingUpdated.has(guild.id)) return;
			try {
				guildsBeingUpdated.add(guild.id);
				const guildCounts = await CountService.init(guild);
				await guildCounts.updateCounters();
			} catch (error) {
				console.error(error);
			} finally {
				guildsBeingUpdated.delete(guild.id);
			}
		});
	}
};

export default updateCounters;
