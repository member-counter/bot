import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const nitroBoostersEvaluator = new DataSourceEvaluator({
  id: DataSourceId.NITRO_BOOSTERS,
  execute: ({ ctx }) => {
    return ctx.guild.premiumSubscriptionCount ?? 0;
  },
});
