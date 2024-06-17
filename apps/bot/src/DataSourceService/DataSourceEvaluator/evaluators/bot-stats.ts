import { BotStatsDataSourceReturn, DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const botStatsEvaluator = new DataSourceEvaluator({
  id: DataSourceId.BOT_STATS,
  execute: async ({
    ctx,
    options: { return: returnType = BotStatsDataSourceReturn.USERS },
  }) => {
    const botStats = await ctx.guild.client.fetchBotStats();

    if (returnType === BotStatsDataSourceReturn.USERS) {
      return botStats.reduce((acc, s) => acc + s.userCount, 0);
    } else {
      return botStats.reduce((acc, s) => acc + s.guildCount, 0);
    }
  },
});
