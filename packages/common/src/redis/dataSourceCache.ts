import { z } from "zod";

import { redis } from "@mc/redis";

import type { DataSourceId } from "../DataSource";

export const DATA_SOURCE_CACHE_BASE_KEY = "dsc";

export function toDataSourceCacheKey<I extends DataSourceId>(
  id: I,
  additionalId: string,
) {
  return `${DATA_SOURCE_CACHE_BASE_KEY}:${id}:${additionalId}`;
}