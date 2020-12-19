import Eris from "eris";
import GuildCountCacheModel from "../models/GuildCountCache";
import Job from "../typings/Job";
import getEnv from "../utils/getEnv";
import sleep from "../utils/sleep";

const { MEMBER_COUNTS_CACHE_CHECK_SLEEP, MEMBER_COUNTS_CACHE_LIFETIME } = getEnv();

const fetchMemberCounts: Job = {
  time: '0 */10 * * * *',
  runAtStartup: true,
  runInOnlyFirstThread: true,
  run: async ({ client }) => {
    // TODO FIX
    const guilds = await client.evalAll('this.client.guilds')
    console.log(guilds);

    return;
    for (const [id] of guilds as Map<string, Eris.Guild>) {
      try {
        await sleep(MEMBER_COUNTS_CACHE_CHECK_SLEEP * 1000);
        let guildCountCache = await GuildCountCacheModel.findOne({ guild: id });
  
        if (!guildCountCache) {
          guildCountCache = new GuildCountCacheModel({
            guild: id,
            timestamp: Date.now(),
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
}

export default fetchMemberCounts;