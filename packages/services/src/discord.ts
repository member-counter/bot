import type { DiscordUser } from "@mc/validators/DiscordUser";
import type { DiscordUserGuild } from "@mc/validators/DiscordUserGuilds";
import { REST } from "@discordjs/rest";
import { PermissionFlagsBits, Routes } from "discord-api-types/v10";

import { BitField } from "@mc/common/BitField";
import { DiscordUserSchema } from "@mc/validators/DiscordUser";
import { DiscordUserGuildsSchema } from "@mc/validators/DiscordUserGuilds";

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

export const DiscordService = {
  async identify(token: string): Promise<DiscordUser> {
    const client = getClient(token);

    const user = await client.get(Routes.user());

    return DiscordUserSchema.parse(user);
  },

  async userGuilds(
    token: string,
  ): Promise<{ userGuilds: Map<string, DiscordUserGuild> }> {
    const client = getClient(token);

    const guilds = await client.get(Routes.userGuilds(), {
      query: new URLSearchParams({ with_counts: "true" }),
    });

    return {
      userGuilds: new Map(
        DiscordUserGuildsSchema.parse(guilds)
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
