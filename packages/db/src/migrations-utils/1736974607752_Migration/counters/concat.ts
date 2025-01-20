import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const ConcatCounter: ConvertCounter = {
  aliases: ["concat"],
  convert: ({ args, format }) => {
    if (!Array.isArray(args) || args.length === 0) {
      return { id: DataSourceId.CONCAT, format };
    }

    const strings = args.map((arg) => String(arg));

    return {
      id: DataSourceId.CONCAT,
      format,
      options: {
        strings,
      },
    };
  },
};

export default ConcatCounter;
