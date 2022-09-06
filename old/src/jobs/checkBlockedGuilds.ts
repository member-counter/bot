import Job from "../typings/Job";
import GuildModel from "../models/GuildModel";

const checkBlockedGuilds: Job = {
	time: "0 0 */1 * * *",
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		GuildModel.find({ blocked: true }, { id: 1 }).then((blockedGuilds) => {
			blockedGuilds.forEach((blockedGuild) => {
				client.guilds.get(blockedGuild.id)?.leave().catch(console.error);
			});
		});
	}
};

export default checkBlockedGuilds;
