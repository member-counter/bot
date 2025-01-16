import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const ClockCounter: ConvertCounter = {
  aliases: ["clock", "time"],
  convert: ({ format, unparsedArgs: timezone }) => {
    return {
      id: DataSourceId.CLOCK,
      format,
      options: {
        timezone,
      },
    };
  },
};

export default ClockCounter;
