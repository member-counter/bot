import assert from "assert";
import { z } from "zod";

import { DataSourceId, MemeratorDataSourceReturn } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";
import { cachedFetch } from "@mc/common/redis/cachedFetch";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";
import { env } from "../../../../env";

const CACHE_LIFETIME = 30 * 60;

const cachedProfileValidator = z.object({
  memes: z.number(),
  followers: z.number(),
});

function fetchProfile(username: string) {
  assert(env.MEMERATOR_API_KEY, new Error("MEMERATOR_API_KEY not provided"));
  const apiKey = env.MEMERATOR_API_KEY;

  return cachedFetch({
    redis,
    key: dataSourceCacheKey(DataSourceId.MEMERATOR, username),
    ttlSeconds: CACHE_LIFETIME,
    fetch: async () => {
      const { stats } = await fetch(
        `https://api.memerator.me/v1/profile/${username}`,
        {
          headers: { Authorization: apiKey },
          signal: AbortSignal.timeout(5000),
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

      return stats satisfies z.infer<typeof cachedProfileValidator>;
    },
    validate: (raw) => cachedProfileValidator.parse(raw),
  });
}

export const memeratorEvaluator = new DataSourceEvaluator({
  id: DataSourceId.MEMERATOR,
  execute: async ({ options }) => {
    assert(options.username, new KnownError("MEMERATOR_MISSING_USERNAME"));

    const profile = await fetchProfile(options.username);

    switch (options.return ?? MemeratorDataSourceReturn.FOLLOWERS) {
      case MemeratorDataSourceReturn.MEMES:
        return profile.memes;

      case MemeratorDataSourceReturn.FOLLOWERS:
        return profile.followers;
    }
  },
});
