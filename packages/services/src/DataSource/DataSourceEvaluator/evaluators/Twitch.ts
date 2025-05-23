import assert from "assert";
import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";

import { DataSourceId, TwitchDataSourceReturn } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";
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

function toCacheKey(username: string, returnType: TwitchDataSourceReturn) {
  return dataSourceCacheKey(
    DataSourceId.TWITCH,
    [username, returnType].join(":"),
  );
}

async function fetchData(
  username: string,
  returnType: TwitchDataSourceReturn = TwitchDataSourceReturn.FOLLOWERS,
) {
  assert(
    client,
    new Error(`"TWITCH_CLIENT_ID" or "TWITCH_CLIENT_SECRET" not provided`),
  );

  const cachedValue = await redis.get(toCacheKey(username, returnType));
  if (cachedValue) {
    switch (returnType) {
      case TwitchDataSourceReturn.VIEWERS:
        return isNaN(Number(cachedValue)) ? cachedValue : Number(cachedValue);

      case TwitchDataSourceReturn.CHANNEL_NAME:
        return cachedValue;

      case TwitchDataSourceReturn.FOLLOWERS:
        return Number(cachedValue);
    }
  }

  const channel = await client.users.getUserByName(username);

  if (!channel) {
    throw new KnownError("TWITCH_CHANNEL_NOT_FOUND");
  }

  const stream = await client.streams.getStreamByUserName(username);

  const viewers = stream ? stream.viewers : "offline";

  const followers = await client.channels.getChannelFollowerCount(channel.id);

  await Promise.all([
    redis.set(
      toCacheKey(username, TwitchDataSourceReturn.FOLLOWERS),
      followers,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(username, TwitchDataSourceReturn.CHANNEL_NAME),
      channel.displayName,
      "EX",
      CACHE_LIFETIME,
    ),
    redis.set(
      toCacheKey(username, TwitchDataSourceReturn.VIEWERS),
      viewers,
      "EX",
      CACHE_LIFETIME,
    ),
  ]);

  switch (returnType) {
    case TwitchDataSourceReturn.VIEWERS:
      return isNaN(Number(viewers)) ? viewers : Number(viewers);

    case TwitchDataSourceReturn.CHANNEL_NAME:
      return channel.displayName;

    case TwitchDataSourceReturn.FOLLOWERS:
      return followers;
  }
}

export const twitchEvaluator = new DataSourceEvaluator({
  id: DataSourceId.TWITCH,
  execute: ({ ctx, options }) => {
    const { isPremium } = ctx.guild.client.botInstanceOptions;
    assert(isPremium, new KnownError("BOT_IS_NOT_PREMIUM"));
    assert(options.username, new KnownError("TWITCH_MISSING_USERNAME"));

    return fetchData(options.username, options.return);
  },
});
