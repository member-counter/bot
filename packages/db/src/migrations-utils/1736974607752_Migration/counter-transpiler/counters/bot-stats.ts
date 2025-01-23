import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { BotStatsDataSourceReturn, DataSourceId } from "../types/DataSource";

const BotStatsCounter: ConvertCounter = {
  aliases: ["member-counter-users", "member-counter-guilds"],
  convert: ({ aliasUsed, format }) => {
    return {
      id: DataSourceId.BOT_STATS,
      format,
      options: {
        return:
          safeCounterName("member-counter-users") === aliasUsed
            ? BotStatsDataSourceReturn.USERS
            : BotStatsDataSourceReturn.GUILDS,
      },
    };
  },
};

export default BotStatsCounter;
