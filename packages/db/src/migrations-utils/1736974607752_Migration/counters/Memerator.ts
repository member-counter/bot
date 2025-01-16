import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { DataSourceId, MemeratorDataSourceReturn } from "../types/DataSource";

const MemeratorCounter: ConvertCounter = {
  aliases: ["memeratorFollowers", "memeratorMemes"],
  convert: ({ unparsedArgs: username, aliasUsed, format }) => {
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
