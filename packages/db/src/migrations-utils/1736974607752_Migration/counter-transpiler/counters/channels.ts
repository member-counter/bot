import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const ChannelCounter: ConvertCounter = {
  aliases: ["channels"],
  convert: ({ args, format }) => {
    const targetCategories = args[0] ?? [];
    return {
      id: DataSourceId.CHANNELS,
      format,
      options: targetCategories.length
        ? {
            categories: targetCategories,
          }
        : undefined,
    };
  },
};

export default ChannelCounter;
