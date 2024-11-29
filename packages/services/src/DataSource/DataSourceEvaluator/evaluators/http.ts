import assert from "assert";
import { z } from "zod";

import { DataSourceId } from "@mc/common/DataSource";
import jsonBodyExtractor from "@mc/common/jsonBodyExtractor";
import { KnownError } from "@mc/common/KnownError/index";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";

const cachedValueValidator = z.object({
  body: z.string(),
  contentType: z.string(),
});

function toCacheKey(url: string) {
  return dataSourceCacheKey(DataSourceId.HTTP, url);
}

async function fetchData(url: string, lifetime?: number) {
  if (lifetime) {
    const cachedValue = await redis.get(toCacheKey(url));
    if (cachedValue) return cachedValueValidator.parse(JSON.parse(cachedValue));
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    headers: {
      "User-Agent": `Member Counter Discord Bot`,
    },
  });

  assert(
    response.status === 200,
    new KnownError({
      type: "DataSourceError",
      name: "HTTP_INVALID_RESPONSE_STATUS_CODE",
    }),
  );

  const contentType = response.headers.get("Content-Type")?.split(";")[0] ?? "";

  assert(
    ["text/plain", "application/json"].includes(contentType),
    new KnownError({
      type: "DataSourceError",
      name: "HTTP_INVALID_RESPONSE_CONTENT_TYPE",
    }),
  );

  const body = await response.text();

  const value = { body, contentType };

  if (lifetime) {
    await redis.set(toCacheKey(url), JSON.stringify(value), "EX", lifetime);
  }

  return value;
}

export const HTTPEvaluator = new DataSourceEvaluator({
  id: DataSourceId.HTTP,
  execute: async ({ options }) => {
    assert(
      options.url,
      new KnownError({ type: "DataSourceError", name: "HTTP_MISSING_URL" }),
    );

    const { body, contentType } = await fetchData(
      options.url,
      options.lifetime,
    );

    if (contentType === "application/json") {
      assert(
        options.dataPath,
        new KnownError({
          type: "DataSourceError",
          name: "HTTP_DATA_PATH_MANDATORY",
        }),
      );

      return jsonBodyExtractor(JSON.parse(body), options.dataPath);
    } else {
      return body;
    }
  },
});
