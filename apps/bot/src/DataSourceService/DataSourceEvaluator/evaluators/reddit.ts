import assert from "assert";
import { z } from "zod";

import { DataSourceId, RedditDataSourceReturn } from "@mc/common/DataSource";
import { toDataSourceCacheKey } from "@mc/common/redis/dataSourceCache";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";
import { DataSourceEvaluationError } from "../DataSourceEvaluationError";

const CACHE_LIFETIME = 15 * 60;

function toCacheKey(subreddit: string, returnType: RedditDataSourceReturn) {
  return toDataSourceCacheKey(
    DataSourceId.REDDIT,
    [subreddit, returnType].join(":"),
  );
}

async function fetchData(
  subreddit: string,
  returnType: RedditDataSourceReturn = RedditDataSourceReturn.MEMBERS,
) {
  const cachedValue = await redis.get(toCacheKey(subreddit, returnType));
  if (cachedValue) return cachedValue;

  const abortSignal = new AbortController();
  setTimeout(() => abortSignal.abort(), 5000);
  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}/about.json`,
    {
      signal: abortSignal.signal,
    },
  )
    .then((response) => response.json())
    .then((o) =>
      z
        .object({
          subscribers: z.number(),
          active_user_count: z.number(),
          title: z.string(),
        })
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
    assert(
      options.subreddit,
      new DataSourceEvaluationError("REDDIT_MISSING_SUBREDDIT"),
    );

    return await fetchData(options.subreddit, options.return);
  },
});
