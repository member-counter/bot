import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { toUnparsedArgsCompat } from "../toUnparsedArgsCompat";
import { DataSourceId, MemeratorDataSourceReturn } from "../types/DataSource";

const MemeratorCounter: ConvertCounter = {
  aliases: ["memeratorFollowers", "memeratorMemes"],
  convert: ({ args, aliasUsed, format }) => {
    const username = toUnparsedArgsCompat(args);
    return {
      id: DataSourceId.MEMERATOR,
      format,
      options: {
        username,
        return:
          safeCounterName("memeratorFollowers") === aliasUsed
            ? MemeratorDataSourceReturn.FOLLOWERS
            : MemeratorDataSourceReturn.MEMES,
      },
    };
  },
};

export default MemeratorCounter;
