import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { toUnparsedArgsCompat } from "../toUnparsedArgsCompat";
import { DataSourceId, YouTubeDataSourceReturn } from "../types/DataSource";

const YouTubeCounter: ConvertCounter = {
  aliases: [
    "youtubeSubscribers",
    "youtubeViews",
    "youtubeVideos",
    "youtubeChannelName",
  ],
  convert: ({ args, format, aliasUsed }) => {
    const channelUrl = toUnparsedArgsCompat(args);
    return {
      id: DataSourceId.YOUTUBE,
      format,
      options: {
        channelUrl,
        return:
          safeCounterName("youtubeSubscribers") === aliasUsed
            ? YouTubeDataSourceReturn.SUBSCRIBERS
            : safeCounterName("youtubeViews") === aliasUsed
              ? YouTubeDataSourceReturn.VIEWS
              : safeCounterName("youtubeVideos") === aliasUsed
                ? YouTubeDataSourceReturn.VIDEOS
                : YouTubeDataSourceReturn.CHANNEL_NAME,
      },
    };
  },
};

export default YouTubeCounter;
