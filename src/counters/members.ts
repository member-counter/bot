import Counter from "../typings/Counter";
import getEnv from "../utils/getEnv";

const { PREMIUM_BOT } = getEnv();

const MemberCounter: Counter = {
  aliases: ["members", "count"],
  isPremium: false,
  isEnabled: true,
  lifetime: 0,
  execute: async ({ guild, client }) => {
    if (PREMIUM_BOT) {
      return guild.memberCount;
    } else {
      const extendedGuild = await client.getRESTGuild(guild.id, true);
      return {
        members: extendedGuild.approximateMemberCount,
        approximatedOnlineMembers: extendedGuild.approximatePresenceCount,
      };
    }
  },
};

export default MemberCounter;
