import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const rolesEvaluator = new DataSourceEvaluator({
  id: DataSourceId.ROLES,
  execute: ({ ctx }) => {
    return ctx.guild.roles.cache.size;
  },
});
