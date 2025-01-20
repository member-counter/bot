import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { toUnparsedArgsCompat } from "../toUnparsedArgsCompat";
import { DataSourceId, TwitchDataSourceReturn } from "../types/DataSource";

const TwitchCounter: ConvertCounter = {
  aliases: ["twitchFollowers", "twitchViewers", "twitchChannelName"],
  convert: ({ args, aliasUsed, format }) => {
    const username = toUnparsedArgsCompat(args);
    return {
      id: DataSourceId.TWITCH,
      format,
      options: {
        username,
        return:
          safeCounterName("twitchFollowers") === aliasUsed
            ? TwitchDataSourceReturn.FOLLOWERS
            : safeCounterName("twitchViewers") === aliasUsed
              ? TwitchDataSourceReturn.VIEWERS
              : TwitchDataSourceReturn.CHANNEL_NAME,
      },
    };
  },
};

export default TwitchCounter;
