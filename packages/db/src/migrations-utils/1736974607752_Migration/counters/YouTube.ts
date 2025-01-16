import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { DataSourceId, YouTubeDataSourceReturn } from "../types/DataSource";

const YouTubeCounter: ConvertCounter = {
  aliases: [
    "youtubeSubscribers",
    "youtubeViews",
    "youtubeVideos",
    "youtubeChannelName",
  ],
  convert: ({ unparsedArgs: channelUrl, format, aliasUsed }) => {
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
