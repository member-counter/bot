import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const CountdownCounter: ConvertCounter = {
  aliases: ["countdown"],
  convert: ({ args, format }) => {
    const clockFormat = args[1]?.[0] ?? "%d:%h:%m";
    const date = parseInt(args[0]?.[0] ?? "0", 10) * 1000 || 0;
    return {
      id: DataSourceId.COUNTDOWN,
      format,
      options: {
        format: clockFormat,
        date,
      },
    };
  },
};

export default CountdownCounter;
