import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { DataSourceId, TwitterDataSourceReturn } from "../types/DataSource";

const TwitterCounter: ConvertCounter = {
  aliases: ["twitterFollowers", "twitterName"],
  convert: ({ unparsedArgs: username, format, aliasUsed }) => {
    return {
      id: DataSourceId.TWITTER,
      format,
      options: {
        username,
        return:
          safeCounterName("twitterFollowers") === aliasUsed
            ? TwitterDataSourceReturn.FOLLOWERS
            : TwitterDataSourceReturn.NAME,
      },
    };
  },
};

export default TwitterCounter;
