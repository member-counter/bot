import Eris from "eris";
import GuildCountCacheModel from "../models/GuildCountCache";
import Job from "../typings/Job";
import getEnv from "../utils/getEnv";
import sleep from "../utils/sleep";

const {
	MEMBER_COUNTS_CACHE_CHECK_SLEEP,
	MEMBER_COUNTS_CACHE_LIFETIME,
	MEMBER_COUNTS_BURST_RATE
} = getEnv();

const fetchMemberCounts: Job = {
	time: "* * * * * *",
	runAtStartup: true,
	runInOnlyFirstThread: true,
	run: async ({ client }) => {
		const guilds = ((await client.evalAll(
			`[...this.client.guilds.keys()]`
		)) as string[][])?.flat();

		const startTimestamp = Date.now();
		let fetchGuildCount = 0;
		let burstCount = 0;
		for (const id of guilds) {
			try {
				if (burstCount > MEMBER_COUNTS_BURST_RATE) {
					burstCount = 0;
					await sleep(MEMBER_COUNTS_CACHE_CHECK_SLEEP * 1000);
				}

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
				fetchGuildCount++;
				burstCount++;

				guildCountCache.members = guild.approximateMemberCount;
				guildCountCache.onlineMembers = guild.approximatePresenceCount;
				guildCountCache.timestamp = Date.now();
				await guildCountCache.save();
			} catch (err) {
				console.error(err);
			} finally {
			}
		}

		console.info(`${fetchGuildCount} guilds of ${guilds.length} were fetched in ${(Date.now() - startTimestamp) / 1000} seconds`)
	}
};

export default fetchMemberCounts;
