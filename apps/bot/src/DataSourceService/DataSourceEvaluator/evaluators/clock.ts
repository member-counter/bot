import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const clockEvaluator = new DataSourceEvaluator({
  id: DataSourceId.CLOCK,
  execute({ options, format }) {
    const coeff = 1000 * 60 * 5;
    const date = new Date();
    const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);

    return new Intl.DateTimeFormat(format.locale, {
      hour: "numeric",
      minute: "numeric",
      timeZone: options.timezone,
    }).format(rounded);
  },
});
