import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const numberEvaluator = new DataSourceEvaluator({
  id: DataSourceId.NUMBER,
  execute: ({ options }) => {
    return Number(options.number);
  },
});
