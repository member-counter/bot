import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const countdownEvaluator = new DataSourceEvaluator({
  id: DataSourceId.COUNTDOWN,
  execute: ({ options }) => {
    const format = options.format ?? "%d:%h:%m";
    const date = options.date ?? 0;

    let timeLeft = new Date(date - Date.now());
    if (date - Date.now() < 0) timeLeft = new Date(0);

    const formatted = format
      .replace(/%d/g, `${Math.floor(timeLeft.getTime() / 1000 / 60 / 60 / 24)}`)
      .replace(/%h/g, `${timeLeft.getUTCHours()}`)
      .replace(/%m/g, `${timeLeft.getUTCMinutes()}`)
      .replace(/%s/g, `${timeLeft.getUTCSeconds()}`)
      .replace(/%D/g, `${Math.floor(timeLeft.getTime() / 1000 / 60 / 60 / 24)}`)
      .replace(/%H/g, `${Math.floor(timeLeft.getTime() / 1000 / 60 / 60)}`)
      .replace(/%M/g, `${Math.floor(timeLeft.getTime() / 1000 / 60)}`)
      .replace(/%S/g, `${Math.floor(timeLeft.getTime() / 1000)}`);

    return formatted;
  },
});
