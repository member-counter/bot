import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";
import { toNumber } from "../wrappers";

const CountdownCounter: ConvertCounter = {
  aliases: ["countdown"],
  convert: ({ args, format }) => {
    const clockFormat = args[1]?.[0] ?? "%d:%h:%m";
    const date = args[0]?.[0] != null ? toNumber(args[0][0]) : undefined;

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
