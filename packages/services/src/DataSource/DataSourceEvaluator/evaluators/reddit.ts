import assert from "assert";
import { z } from "zod";

import { DataSourceId, RedditDataSourceReturn } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";
import { cachedFetch } from "@mc/common/redis/cachedFetch";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";

const CACHE_LIFETIME = 15 * 60;

const cachedSubredditValidator = z.object({
  title: z.string(),
  members: z.number(),
  membersOnline: z.number(),
});

const fetchSubreddit = (subreddit: string) =>
  cachedFetch({
    redis,
    key: dataSourceCacheKey(DataSourceId.REDDIT, subreddit),
    ttlSeconds: CACHE_LIFETIME,
    fetch: async () => {
      const { data } = await fetch(
        `https://www.reddit.com/r/${subreddit}/about.json`,
        {
          signal: AbortSignal.timeout(5000),
        },
      )
        .then((response) => response.json())
        .then((o) =>
          z
            .object({
              data: z.object({
                subscribers: z.number(),
                active_user_count: z.number(),
                title: z.string(),
              }),
            })
            .parse(o),
        );

      return {
        title: data.title,
        members: data.subscribers,
        membersOnline: data.active_user_count,
      } satisfies z.infer<typeof cachedSubredditValidator>;
    },
    validate: (raw) => cachedSubredditValidator.parse(raw),
  });

export const redditEvaluator = new DataSourceEvaluator({
  id: DataSourceId.REDDIT,
  execute: async ({ options }) => {
    assert(options.subreddit, new KnownError("REDDIT_MISSING_SUBREDDIT"));

    const subreddit = await fetchSubreddit(options.subreddit);

    switch (options.return ?? RedditDataSourceReturn.MEMBERS) {
      case RedditDataSourceReturn.TITLE:
        return subreddit.title;

      case RedditDataSourceReturn.MEMBERS:
        return subreddit.members;

      case RedditDataSourceReturn.MEMBERS_ONLINE:
        return subreddit.membersOnline;
    }
  },
});
