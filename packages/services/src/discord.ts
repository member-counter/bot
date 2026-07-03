import { createHash } from "node:crypto";
import type { CachedDiscordUser } from "@mc/common/redis/DiscordUserCache";
import type { DiscordUser } from "@mc/validators/DiscordUser";
import type { DiscordUserGuild } from "@mc/validators/DiscordUserGuilds";
import { REST } from "@discordjs/rest";
import { PermissionFlagsBits, Routes } from "discord-api-types/v10";

import { BitField } from "@mc/common/BitField";
import { cachedFetch } from "@mc/common/redis/cachedFetch";
import {
  CachedDiscordUserValidator,
  DISCORD_USER_CACHE_TTL,
} from "@mc/common/redis/DiscordUserCache";
import {
  discordIdentityCacheKey,
  discordUserCacheKey,
  discordUserGuildsCacheKey,
} from "@mc/common/redis/keys";
import { redis } from "@mc/redis";
import { DiscordUserSchema } from "@mc/validators/DiscordUser";
import { DiscordUserGuildsSchema } from "@mc/validators/DiscordUserGuilds";

import { botAPIConsumer } from "./botAPI/botAPIConsumer";

const clientCache = new Map<string, { client: REST; lastUsed: number }>();
const CLIENT_TTL = 10 * 60 * 1000; // 10 minutes
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of clientCache) {
    if (now - entry.lastUsed > CLIENT_TTL) {
      clientCache.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

function getClient(token: string): REST {
  const cacheKey = token;
  const existing = clientCache.get(cacheKey);
  if (existing) {
    existing.lastUsed = Date.now();
    return existing.client;
  }

  const client = new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(token);

  clientCache.set(cacheKey, { client, lastUsed: Date.now() });
  return client;
}

// /users/@me and /users/@me/guilds are heavily rate limited per user token and
// the dashboard needs both on every load, so responses are cached briefly and
// concurrent callers share a single in-flight request. Kept short: the
// frontend refetches on window focus to pick up permission changes made in
// Discord, and permission checks read through this same cache.
const RESPONSE_CACHE_TTL = 15; // seconds

const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const DiscordService = {
  async identify(token: string): Promise<DiscordUser> {
    return cachedFetch({
      redis,
      key: discordIdentityCacheKey(tokenHash(token)),
      ttlSeconds: RESPONSE_CACHE_TTL,
      fetch: () => getClient(token).get(Routes.user()),
      validate: (raw) => DiscordUserSchema.parse(raw),
    });
  },

  /**
   * Discord user profile served from the profile cache the bot fleet already
   * maintains; only a cache miss pays the cross-server RPC, which
   * re-populates the same key for everyone.
   */
  async getUser(id: string): Promise<CachedDiscordUser> {
    return cachedFetch({
      redis,
      key: discordUserCacheKey(id),
      ttlSeconds: DISCORD_USER_CACHE_TTL,
      fetch: () => botAPIConsumer.discord.getUser.query({ id }),
      validate: (raw) => CachedDiscordUserValidator.parse(raw),
    });
  },

  async userGuilds(
    token: string,
  ): Promise<{ userGuilds: Map<string, DiscordUserGuild> }> {
    const guilds = await cachedFetch({
      redis,
      key: discordUserGuildsCacheKey(tokenHash(token)),
      ttlSeconds: RESPONSE_CACHE_TTL,
      fetch: () =>
        getClient(token).get(Routes.userGuilds(), {
          query: new URLSearchParams({ with_counts: "true" }),
        }),
      validate: (raw) => DiscordUserGuildsSchema.parse(raw),
    });

    return {
      userGuilds: new Map(
        guilds
          .sort((guild) =>
            new BitField(guild.permissions).any(
              PermissionFlagsBits.Administrator |
                PermissionFlagsBits.ManageGuild,
            )
              ? -1
              : 1,
          )
          .map((guild) => [guild.id, guild]),
      ),
    };
  },
};
