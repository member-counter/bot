import assert from "assert";
import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";
import { z } from "zod";

import { DataSourceId, TwitchDataSourceReturn } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";
import { cachedFetch } from "@mc/common/redis/cachedFetch";
import { dataSourceCacheKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { DataSourceEvaluator } from "..";
import { env } from "../../../../env";

function createClient() {
  if (env.TWITCH_CLIENT_ID == null || env.TWITCH_CLIENT_SECRET == null) return;

  const authProvider = new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
  );

  return new ApiClient({ authProvider });
}

const client = createClient();

const CACHE_LIFETIME = 15 * 60;

const cachedChannelValidator = z.object({
  channelName: z.string(),
  followers: z.number(),
  viewers: z.union([z.number(), z.literal("offline")]),
});

function fetchChannel(username: string) {
  assert(
    client,
    new Error(`"TWITCH_CLIENT_ID" or "TWITCH_CLIENT_SECRET" not provided`),
  );
  const twitch = client;

  return cachedFetch({
    redis,
    key: dataSourceCacheKey(DataSourceId.TWITCH, username),
    ttlSeconds: CACHE_LIFETIME,
    fetch: async () => {
      const channel = await twitch.users.getUserByName(username);

      if (!channel) {
        throw new KnownError("TWITCH_CHANNEL_NOT_FOUND");
      }

      const stream = await twitch.streams.getStreamByUserName(username);
      const followers = await twitch.channels.getChannelFollowerCount(
        channel.id,
      );

      return {
        channelName: channel.displayName,
        followers,
        viewers: stream ? stream.viewers : ("offline" as const),
      } satisfies z.infer<typeof cachedChannelValidator>;
    },
    validate: (raw) => cachedChannelValidator.parse(raw),
  });
}

export const twitchEvaluator = new DataSourceEvaluator({
  id: DataSourceId.TWITCH,
  execute: async ({ ctx, options }) => {
    const { isPremium } = ctx.guild.client.botInstanceOptions;
    assert(isPremium, new KnownError("BOT_IS_NOT_PREMIUM"));
    assert(options.username, new KnownError("TWITCH_MISSING_USERNAME"));

    const channel = await fetchChannel(options.username);

    switch (options.return ?? TwitchDataSourceReturn.FOLLOWERS) {
      case TwitchDataSourceReturn.VIEWERS:
        return channel.viewers;

      case TwitchDataSourceReturn.CHANNEL_NAME:
        return channel.channelName;

      case TwitchDataSourceReturn.FOLLOWERS:
        return channel.followers;
    }
  },
});
