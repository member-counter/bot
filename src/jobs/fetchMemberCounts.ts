import Eris from "eris";
import GuildCountCacheModel from "../models/GuildCountCache";
import Job from "../typings/Job";
import getEnv from "../utils/getEnv";
import sleep from "../utils/sleep";

const {
	MEMBER_COUNTS_CACHE_CHECK_SLEEP,
	MEMBER_COUNTS_CACHE_LIFETIME,
	PREMIUM_BOT
} = getEnv();

// TODO fix this: not updating cache at all when MEMBER_COUNTS_CACHE_CHECK_SLEEP and MEMBER_COUNTS_CACHE_LIFETIME is set
const fetchMemberCounts: Job = {
	time: "0 */10 * * * *",
	runAtStartup: true,
	runInOnlyFirstThread: true,
	run: async ({ client }) => {
		/**
		 * The main and the premium bot are "connected" throught redis,
		 * the premium bot tries to fetch guilds of the main bot which doesn't have access, and it's useless,
		 * since the premium bot runs in only one proccess, we can obtain the guild list directly
		 */
		const guilds = PREMIUM_BOT
			? ((client.guilds.keys() as unknown) as string[])
			: ((await client.evalAll(
					"[...this.client.guilds.keys()]"
			  )) as string[]).flat();

		for (const id of guilds) {
			try {
				await sleep(MEMBER_COUNTS_CACHE_CHECK_SLEEP * 1000);
				let guildCountCache = await GuildCountCacheModel.findOne({ id });

				if (!guildCountCache) {
					guildCountCache = new GuildCountCacheModel({
						id,
						timestamp: Date.now()
					});
				} else if (
					guildCountCache?.timestamp + MEMBER_COUNTS_CACHE_LIFETIME * 1000 >=
					Date.now()
				) {
					continue;
				}

				const guild = await client.getRESTGuild(id, true);

				guildCountCache.members = guild.approximateMemberCount;
				guildCountCache.onlineMembers = guild.approximatePresenceCount;
				guildCountCache.timestamp = Date.now();
				await guildCountCache.save();
			} catch (err) {
				console.error(err);
			}
		}
	}
};

export default fetchMemberCounts;
