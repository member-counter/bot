import { DataSourceId, MathDataSourceOperation } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const mathEvaluator = new DataSourceEvaluator({
  id: DataSourceId.MATH,
  execute: ({ options: { numbers = [], operation } }) => {
    const values = numbers.map((n) => Number(n));

    switch (operation) {
      default:
      case MathDataSourceOperation.ADD:
        return values.reduce((acc, curr) => acc + curr, 0);

      case MathDataSourceOperation.SUBTRACT:
        return values.reduce((acc, curr) => acc - curr, 0);

      case MathDataSourceOperation.MULTIPLY:
        return values.reduce((acc, curr) => acc * curr, 0);

      case MathDataSourceOperation.DIVIDE:
        return values.reduce((acc, curr) => acc / curr, 0);

      case MathDataSourceOperation.MODULO:
        return values.reduce((acc, curr) => acc % curr, 0);
    }
  },
});
