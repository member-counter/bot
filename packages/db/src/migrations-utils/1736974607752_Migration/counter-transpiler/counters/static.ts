import type ConvertCounter from "../types/ConvertCounter";
import { toUnparsedArgsCompat } from "../toUnparsedArgsCompat";
import { DataSourceId } from "../types/DataSource";

const StaticCounter: ConvertCounter = {
  aliases: ["static"],
  convert: ({ args, format }) => {
    const value = toUnparsedArgsCompat(args);
    return {
      id: DataSourceId.NUMBER,
      format,
      options: {
        number: value,
      },
    };
  },
};

export default StaticCounter;
