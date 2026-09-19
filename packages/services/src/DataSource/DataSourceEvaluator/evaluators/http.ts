import assert from "assert";
import { z } from "zod";

import { DataSourceId } from "@mc/common/DataSource";
import jsonBodyExtractor from "@mc/common/jsonBodyExtractor";
import { KnownError } from "@mc/common/KnownError/index";
import { cachedFetch } from "@mc/common/redis/cachedFetch";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";
import { FallbackUsedError } from "../../FallbackUsedError";

const cachedValueValidator = z.object({
  body: z.string(),
  contentType: z.string(),
});

async function fetchUrl(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    headers: {
      "User-Agent": `Member Counter Discord Bot`,
    },
  });

  assert(
    response.status === 200,
    new KnownError("HTTP_INVALID_RESPONSE_STATUS_CODE"),
  );

  const contentType = response.headers.get("Content-Type")?.split(";")[0] ?? "";

  assert(
    ["text/plain", "application/json"].includes(contentType),
    new KnownError("HTTP_INVALID_RESPONSE_CONTENT_TYPE"),
  );

  const body = await response.text();

  return { body, contentType } satisfies z.infer<typeof cachedValueValidator>;
}

// Caching is opt-in per data source: the user configures the lifetime
async function fetchData(url: string, lifetime?: number) {
  if (!lifetime) return fetchUrl(url);

  return cachedFetch({
    redis,
    key: dataSourceCacheKey(DataSourceId.HTTP, url),
    ttlSeconds: lifetime,
    fetch: () => fetchUrl(url),
    validate: (raw) => cachedValueValidator.parse(raw),
  });
}

export const HTTPEvaluator = new DataSourceEvaluator({
  id: DataSourceId.HTTP,
  execute: async ({ options }) => {
    assert(options.url, new KnownError("HTTP_MISSING_URL"));

    try {
      const { body, contentType } = await fetchData(
        options.url,
        options.lifetime,
      );

      if (contentType === "application/json") {
        assert(options.dataPath, new KnownError("HTTP_DATA_PATH_MANDATORY"));

        return jsonBodyExtractor(JSON.parse(body), options.dataPath);
      } else {
        return body;
      }
    } catch (error) {
      if (options.fallback === undefined) throw error;
      throw new FallbackUsedError(
        options.fallback,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
});
