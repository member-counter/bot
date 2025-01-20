import type ConvertCounter from "../types/ConvertCounter";
import { toUnparsedArgsCompat } from "../toUnparsedArgsCompat";
import { DataSourceId } from "../types/DataSource";

const ClockCounter: ConvertCounter = {
  aliases: ["clock", "time"],
  convert: ({ format, args }) => {
    const unparsedArgs = toUnparsedArgsCompat(args);

    return {
      id: DataSourceId.CLOCK,
      format,
      options: {
        timezone: unparsedArgs,
      },
    };
  },
};

export default ClockCounter;
