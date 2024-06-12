import assert from "assert";
import { z } from "zod";

import { DataSourceId, YouTubeDataSourceReturn } from "@mc/common/DataSource";
import { toDataSourceCacheKey } from "@mc/common/redis/dataSourceCache";
import { redis } from "@mc/redis";

import { env } from "~/env";
import { DataSourceEvaluator } from "..";
import { DataSourceEvaluationError } from "../DataSourceEvaluationError";

const resolveToChannelIdValidator = z.object({
  items: z.array(
    z.object({
      id: z.object({
        channelId: z.string(),
      }),
    }),
  ),
});
const channelValidator = z.object({
  items: z.array(
    z.object({
      statistics: z.object({
        videoCount: z.number(),
        subscriberCount: z.number(),
        viewCount: z.number(),
      }),
      snippet: z.object({
        title: z.string(),
      }),
    }),
  ),
});

const legacyUsernameChannelMatch =
  /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/(user|c)\//;
const handleUsernameChannelMatch =
  /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/@/;
const idChannelMatch =
  /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/channel\//;

const CACHE_LIFETIME = 60 * 60;

function toCacheKey(
  channel: string,
  returnType: YouTubeDataSourceReturn | "resolved@username",
) {
  return toDataSourceCacheKey(
    DataSourceId.REDDIT,
    [channel, returnType].join(":"),
  );
}

async function resolveToChannelId(handleUsername: string) {
  const cachedValue = await redis.get(
    toCacheKey(handleUsername, "resolved@username"),
  );
  if (cachedValue) return cachedValue;

  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 5000);

  const channelId = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${handleUsername}&type=channel&key=${env.YOUTUBE_API_KEY}`,
    { signal: abortController.signal },
  )
    .then((response) => response.json())
    .then((o) => resolveToChannelIdValidator.parse(o))
    .then((o) => o.items[0]?.id.channelId);

  await redis.set(
    toCacheKey(handleUsername, "resolved@username"),
    channelId ?? "",
    "EX",
    60 * 60 * 24 * 7,
  );
  return channelId;
}

async function fetchData(
  searchChannel: string,
  searchChannelBy: "id" | "forUsername",
  returnType: YouTubeDataSourceReturn = YouTubeDataSourceReturn.SUBSCRIBERS,
) {
  const cachedValue = await redis.get(
    toCacheKey(searchChannel + searchChannelBy, returnType),
  );
  if (cachedValue) {
    switch (returnType) {
      case YouTubeDataSourceReturn.CHANNEL_NAME:
        return cachedValue;

      case YouTubeDataSourceReturn.VIDEOS:
      case YouTubeDataSourceReturn.SUBSCRIBERS:
      case YouTubeDataSourceReturn.VIEWS:
        return Number(cachedValue);
    }
  }

  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 5000);
  const channel = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&key=${env.YOUTUBE_API_KEY}&${searchChannelBy}=${searchChannel}`,
  )
    .then((response) => response.json())
    .then((o) => channelValidator.parse(o))
    .then((o) => o.items[0]);

  assert(channel);

  await Promise.all([
    redis.set(
      toCacheKey(
        searchChannel + searchChannelBy,
        YouTubeDataSourceReturn.CHANNEL_NAME,
      ),
      channel.snippet.title,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(
        searchChannel + searchChannelBy,
        YouTubeDataSourceReturn.SUBSCRIBERS,
      ),
      channel.statistics.subscriberCount,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(
        searchChannel + searchChannelBy,
        YouTubeDataSourceReturn.VIEWS,
      ),
      channel.statistics.viewCount,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(
        searchChannel + searchChannelBy,
        YouTubeDataSourceReturn.VIDEOS,
      ),
      channel.statistics.videoCount,
      "EX",
      CACHE_LIFETIME,
    ),
  ]);

  switch (returnType) {
    case YouTubeDataSourceReturn.CHANNEL_NAME:
      return channel.snippet.title;

    case YouTubeDataSourceReturn.VIDEOS:
      return channel.statistics.videoCount;

    case YouTubeDataSourceReturn.SUBSCRIBERS:
      return channel.statistics.subscriberCount;

    case YouTubeDataSourceReturn.VIEWS:
      return channel.statistics.viewCount;
  }
}

export const youTubeEvaluator = new DataSourceEvaluator({
  id: DataSourceId.YOUTUBE,
  execute: async ({ options }) => {
    assert(env.YOUTUBE_API_KEY, new Error("YOUTUBE_API_KEY not provided"));
    assert(
      options.channelUrl,
      new DataSourceEvaluationError("YOUTUBE_MISSING_CHANNEL_URL"),
    );

    const legacyUsername = options.channelUrl.replace(
      legacyUsernameChannelMatch,
      "",
    );
    const handleUsernameUsername = options.channelUrl.replace(
      handleUsernameChannelMatch,
      "",
    );
    const channelId = options.channelUrl.replace(idChannelMatch, "");

    let searchChannel: string | undefined = "";
    let searchChannelBy: "id" | "forUsername" | undefined;

    if (legacyUsername) {
      searchChannelBy = "forUsername";
      searchChannel = legacyUsername;
    } else if (handleUsernameUsername) {
      searchChannelBy = "id";
      searchChannel = await resolveToChannelId(handleUsernameUsername);
    } else if (channelId) {
      searchChannelBy = "id";
      searchChannel = channelId;
    }

    assert(
      searchChannel && searchChannelBy,
      new DataSourceEvaluationError("YOUTUBE_INVALID_CHANNEL_URL"),
    );

    return await fetchData(searchChannel, searchChannelBy, options.return);
  },
});
