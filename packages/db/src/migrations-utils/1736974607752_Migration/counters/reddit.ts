import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import { DataSourceId, RedditDataSourceReturn } from "../types/DataSource";

const reddit: ConvertCounter = {
  aliases: ["redditMembers", "redditMembersOnline", "redditTitle"],
  convert: ({ unparsedArgs: subreddit, format, aliasUsed }) => {
    return {
      id: DataSourceId.REDDIT,
      format,
      options: {
        subreddit,
        return:
          safeCounterName("redditMembers") === aliasUsed
            ? RedditDataSourceReturn.MEMBERS
            : safeCounterName("redditMembersOnline") === aliasUsed
              ? RedditDataSourceReturn.MEMBERS_ONLINE
              : RedditDataSourceReturn.TITLE,
      },
    };
  },
};

export default reddit;
