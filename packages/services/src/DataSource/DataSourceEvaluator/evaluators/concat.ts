import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const concatEvaluator = new DataSourceEvaluator({
  id: DataSourceId.CONCAT,
  execute: ({ options: { strings = [] } }) => {
    const values = strings.map((n) => String(n));

    return values.reduce((acc, curr) => acc + curr, "");
  },
});
