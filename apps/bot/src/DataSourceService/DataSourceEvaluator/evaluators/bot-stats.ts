import { BotStatsDataSourceReturn, DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const botStatsEvaluator = new DataSourceEvaluator({
  id: DataSourceId.BOT_STATS,
  execute: ({
    options: { return: _returnType = BotStatsDataSourceReturn.USERS },
  }) => {
    // TODO
    return 0;
  },
});
