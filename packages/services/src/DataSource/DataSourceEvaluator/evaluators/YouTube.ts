import assert from "assert";
import { z } from "zod";

import { DataSourceId, YouTubeDataSourceReturn } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";
import { cachedFetch } from "@mc/common/redis/cachedFetch";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";
import { env } from "../../../../env";

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
  /^(((http|https):\/\/|)(www\.|m\.)?youtube\.com\/)?@/;
const idChannelMatch =
  /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/channel\//;

const CACHE_LIFETIME = 60 * 60;

const cachedChannelValidator = z.object({
  channelName: z.string(),
  videos: z.number(),
  subscribers: z.number(),
  views: z.number(),
});

const fetchChannel = (
  searchChannel: string,
  searchChannelBy: "id" | "forUsername" | "forHandle",
) =>
  cachedFetch({
    redis,
    key: dataSourceCacheKey(
      DataSourceId.YOUTUBE,
      [searchChannelBy, searchChannel].join(":"),
    ),
    ttlSeconds: CACHE_LIFETIME,
    fetch: async () => {
      const channel = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&key=${env.YOUTUBE_API_KEY}&${searchChannelBy}=${searchChannel}`,
        { signal: AbortSignal.timeout(5000) },
      )
        .then((response) => response.json())
        .then((o) => channelValidator.parse(o))
        .then((o) => o.items[0]);

      assert(channel);

      return {
        channelName: channel.snippet.title,
        videos: Number(channel.statistics.videoCount),
        subscribers: Number(channel.statistics.subscriberCount),
        views: Number(channel.statistics.viewCount),
      } satisfies z.infer<typeof cachedChannelValidator>;
    },
    validate: (raw) => cachedChannelValidator.parse(raw),
  });

export const youTubeEvaluator = new DataSourceEvaluator({
  id: DataSourceId.YOUTUBE,
  execute: async ({ ctx, options: { channelUrl, return: returnType } }) => {
    const { isPremium } = ctx.guild.client.botInstanceOptions;
    assert(isPremium, new KnownError("BOT_IS_NOT_PREMIUM"));
    assert(env.YOUTUBE_API_KEY, new Error("YOUTUBE_API_KEY not provided"));
    assert(channelUrl, new KnownError("YOUTUBE_MISSING_CHANNEL_URL"));

    let searchChannel: string | undefined;
    let searchChannelBy: "id" | "forUsername" | "forHandle" | undefined;

    if (legacyUsernameChannelMatch.test(channelUrl)) {
      searchChannelBy = "forUsername";
      searchChannel = channelUrl.replace(legacyUsernameChannelMatch, "");
    } else if (handleUsernameChannelMatch.test(channelUrl)) {
      searchChannelBy = "forHandle";
      searchChannel = channelUrl.replace(handleUsernameChannelMatch, "");
    } else if (idChannelMatch.test(channelUrl)) {
      searchChannelBy = "id";
      searchChannel = channelUrl.replace(idChannelMatch, "");
    }

    assert(
      searchChannel && searchChannelBy,
      new KnownError("YOUTUBE_INVALID_CHANNEL_URL"),
    );

    const channel = await fetchChannel(searchChannel, searchChannelBy);

    switch (returnType ?? YouTubeDataSourceReturn.SUBSCRIBERS) {
      case YouTubeDataSourceReturn.CHANNEL_NAME:
        return channel.channelName;

      case YouTubeDataSourceReturn.VIDEOS:
        return channel.videos;

      case YouTubeDataSourceReturn.SUBSCRIBERS:
        return channel.subscribers;

      case YouTubeDataSourceReturn.VIEWS:
        return channel.views;
    }
  },
});
