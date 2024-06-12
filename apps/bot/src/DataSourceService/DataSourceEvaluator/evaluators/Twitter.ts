import assert from "assert";
import { TwitterApi } from "twitter-api-v2";

import { DataSourceId, TwitterDataSourceReturn } from "@mc/common/DataSource";
import { toDataSourceCacheKey } from "@mc/common/redis/dataSourceCache";
import { redis } from "@mc/redis";

import { env } from "~/env";
import { DataSourceEvaluator } from "..";
import { DataSourceEvaluationError } from "../DataSourceEvaluationError";

const CACHE_LIFETIME = 5 * 60;
const appOnlyClient =
  env.TWITTER_BEARER_TOKEN && new TwitterApi(env.TWITTER_BEARER_TOKEN);

function toCacheKey(username: string, returnType: TwitterDataSourceReturn) {
  return toDataSourceCacheKey(
    DataSourceId.TWITTER,
    [username, returnType].join(":"),
  );
}

async function fetchData(
  username: string,
  returnType: TwitterDataSourceReturn = TwitterDataSourceReturn.FOLLOWERS,
) {
  assert(appOnlyClient, new Error("TWITTER_BEARER_TOKEN not provided"));

  const cachedValue = await redis.get(toCacheKey(username, returnType));
  if (cachedValue) return cachedValue;

  const twitterUser = await appOnlyClient.v1.user({ screen_name: username });

  assert(
    twitterUser.followers_count,
    new DataSourceEvaluationError("TWITTER_PRIVATE_ACCOUNT"),
  );

  await Promise.all([
    redis.set(
      toCacheKey(username, TwitterDataSourceReturn.FOLLOWERS),
      twitterUser.followers_count,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(username, TwitterDataSourceReturn.NAME),
      twitterUser.name,
      "EX",
      CACHE_LIFETIME,
    ),
  ]);

  switch (returnType) {
    case TwitterDataSourceReturn.NAME:
      return twitterUser.name;

    case TwitterDataSourceReturn.FOLLOWERS:
      return twitterUser.followers_count;
  }
}

export const twitterEvaluator = new DataSourceEvaluator({
  id: DataSourceId.TWITTER,
  execute: async ({ options }) => {
    assert(
      options.username,
      new DataSourceEvaluationError("TWITTER_MISSING_USERNAME"),
    );

    return Number(await fetchData(options.username, options.return));
  },
});
