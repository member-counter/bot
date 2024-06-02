import Job from "../typings/Job";
import GuildSettingsModel from "../models/GuildSettingsModel";
import logger from "../logger";

const checkBlockedGuilds: Job = {
	time: "0 0 */1 * * *",
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		GuildSettingsModel.find({ blocked: true }, { id: 1 }).then(
			(blockedGuilds) => {
				blockedGuilds.forEach((blockedGuild) => {
					client.guilds.cache.get(blockedGuild.id)?.leave().catch(logger.error);
				});
			}
		);
	}
};

export default checkBlockedGuilds;
