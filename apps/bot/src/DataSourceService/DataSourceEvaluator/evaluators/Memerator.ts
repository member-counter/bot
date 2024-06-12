import assert from "assert";
import { z } from "zod";

import { DataSourceId, MemeratorDataSourceReturn } from "@mc/common/DataSource";
import { toDataSourceCacheKey } from "@mc/common/redis/dataSourceCache";
import { redis } from "@mc/redis";

import { env } from "~/env";
import { DataSourceEvaluator } from "..";
import { DataSourceEvaluationError } from "../DataSourceEvaluationError";

const CACHE_LIFETIME = 30 * 60;

function toCacheKey(username: string, returnType: MemeratorDataSourceReturn) {
  return toDataSourceCacheKey(
    DataSourceId.MEMERATOR,
    [username, returnType].join(":"),
  );
}

async function fetchData(
  username: string,
  returnType: MemeratorDataSourceReturn = MemeratorDataSourceReturn.FOLLOWERS,
) {
  assert(env.MEMERATOR_API_KEY, new Error("MEMERATOR_API_KEY not provided"));

  const cachedValue = await redis.get(toCacheKey(username, returnType));
  if (cachedValue) return Number(cachedValue);

  const abortSignal = new AbortController();
  setTimeout(() => abortSignal.abort(), 5000);
  const response = await fetch(
    `https://api.memerator.me/v1/profile/${username}`,
    {
      headers: { Authorization: env.MEMERATOR_API_KEY },
      signal: abortSignal.signal,
    },
  )
    .then((response) => response.json())
    .then((o) =>
      z
        .object({
          stats: z.object({ memes: z.number(), followers: z.number() }),
        })
        .parse(o),
    );

  await Promise.all([
    redis.set(
      toCacheKey(username, MemeratorDataSourceReturn.FOLLOWERS),
      response.stats.followers,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(username, MemeratorDataSourceReturn.MEMES),
      response.stats.memes,
      "EX",
      CACHE_LIFETIME,
    ),
  ]);

  switch (returnType) {
    case MemeratorDataSourceReturn.MEMES:
      return response.stats.memes;

    case MemeratorDataSourceReturn.FOLLOWERS:
      return response.stats.followers;
  }
}

export const memeratorEvaluator = new DataSourceEvaluator({
  id: DataSourceId.MEMERATOR,
  execute: async ({ options }) => {
    assert(
      options.username,
      new DataSourceEvaluationError("MEMERATOR_MISSING_USERNAME"),
    );

    return Number(await fetchData(options.username, options.return));
  },
});
