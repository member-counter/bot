import assert from "assert";
import { z } from "zod";

import { DataSourceId, YouTubeDataSourceReturn } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";
import { env } from "../../../../env";

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
        videoCount: z.string(),
        subscriberCount: z.string(),
        viewCount: z.string(),
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
  return dataSourceCacheKey(
    DataSourceId.REDDIT,
    [channel, returnType].join(":"),
  );
}

async function resolveToChannelId(handleUsername: string) {
  const cachedValue = await redis.get(
    toCacheKey(handleUsername, "resolved@username"),
  );
  if (cachedValue) return cachedValue;

  const channelId = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${handleUsername}&type=channel&key=${env.YOUTUBE_API_KEY}`,
    { signal: AbortSignal.timeout(5000) },
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

  const channel = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&key=${env.YOUTUBE_API_KEY}&${searchChannelBy}=${searchChannel}`,
    { signal: AbortSignal.timeout(5000) },
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
      return Number(channel.statistics.videoCount);

    case YouTubeDataSourceReturn.SUBSCRIBERS:
      return Number(channel.statistics.subscriberCount);

    case YouTubeDataSourceReturn.VIEWS:
      return Number(channel.statistics.viewCount);
  }
}

export const youTubeEvaluator = new DataSourceEvaluator({
  id: DataSourceId.YOUTUBE,
  execute: async ({ ctx, options: { channelUrl, return: returnType } }) => {
    const { isPremium } = ctx.guild.client.botInstanceOptions;
    assert(isPremium, new KnownError("BOT_IS_NOT_PREMIUM"));
    assert(env.YOUTUBE_API_KEY, new Error("YOUTUBE_API_KEY not provided"));
    assert(channelUrl, new KnownError("YOUTUBE_MISSING_CHANNEL_URL"));

    let searchChannel: string | undefined = "";
    let searchChannelBy: "id" | "forUsername" | undefined;

    if (legacyUsernameChannelMatch.test(channelUrl)) {
      searchChannelBy = "forUsername";
      searchChannel = channelUrl.replace(legacyUsernameChannelMatch, "");
    } else if (handleUsernameChannelMatch.test(channelUrl)) {
      searchChannelBy = "id";
      searchChannel = await resolveToChannelId(
        channelUrl.replace(handleUsernameChannelMatch, ""),
      );
    } else if (idChannelMatch.test(channelUrl)) {
      searchChannelBy = "id";
      searchChannel = channelUrl.replace(idChannelMatch, "");
    }

    assert(
      searchChannel && searchChannelBy,
      new KnownError("YOUTUBE_INVALID_CHANNEL_URL"),
    );

    return await fetchData(searchChannel, searchChannelBy, returnType);
  },
});
