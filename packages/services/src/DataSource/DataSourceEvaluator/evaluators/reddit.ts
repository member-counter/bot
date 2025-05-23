import assert from "assert";
import { z } from "zod";

import { DataSourceId, RedditDataSourceReturn } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";

const CACHE_LIFETIME = 15 * 60;

function toCacheKey(subreddit: string, returnType: RedditDataSourceReturn) {
  return dataSourceCacheKey(
    DataSourceId.REDDIT,
    [subreddit, returnType].join(":"),
  );
}

async function fetchData(
  subreddit: string,
  returnType: RedditDataSourceReturn = RedditDataSourceReturn.MEMBERS,
) {
  const cachedValue = await redis.get(toCacheKey(subreddit, returnType));
  if (cachedValue) {
    switch (returnType) {
      case RedditDataSourceReturn.TITLE:
        return cachedValue;

      case RedditDataSourceReturn.MEMBERS:
      case RedditDataSourceReturn.MEMBERS_ONLINE:
        return Number(cachedValue);
    }
  }

  const response = await fetch(
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
        .transform(({ data: { ...data } }) => data)
        .parse(o),
    );

  await Promise.all([
    redis.set(
      toCacheKey(subreddit, RedditDataSourceReturn.TITLE),
      response.title,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(subreddit, RedditDataSourceReturn.MEMBERS),
      response.subscribers,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(subreddit, RedditDataSourceReturn.MEMBERS_ONLINE),
      response.active_user_count,
      "EX",
      CACHE_LIFETIME,
    ),
  ]);

  switch (returnType) {
    case RedditDataSourceReturn.TITLE:
      return response.title;

    case RedditDataSourceReturn.MEMBERS:
      return response.subscribers;

    case RedditDataSourceReturn.MEMBERS_ONLINE:
      return response.active_user_count;
  }
}

export const redditEvaluator = new DataSourceEvaluator({
  id: DataSourceId.REDDIT,
  execute: async ({ options }) => {
    assert(options.subreddit, new KnownError("REDDIT_MISSING_SUBREDDIT"));

    return await fetchData(options.subreddit, options.return);
  },
});
