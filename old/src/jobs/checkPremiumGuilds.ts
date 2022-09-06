import GuildService from "../services/GuildService";
import Job from "../typings/Job";
import getEnv from "../utils/getEnv";

const { PREMIUM_BOT, UNRESTRICTED_MODE } = getEnv();

const checkPremiumGuilds: Job = {
	time: "0 0 */1 * * *",
	runAtStartup: false,
	runInOnlyFirstThread: false,
	run: async ({ client }) => {
		if (PREMIUM_BOT && !UNRESTRICTED_MODE) {
			client.guilds.forEach(async (guild) => {
				const guildSettings = await GuildService.init(guild.id);
				if (!guildSettings.premium) guild.leave().catch(console.error);
			});
		}
	}
};

export default checkPremiumGuilds;
