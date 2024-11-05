import type { DiscordUser } from "@mc/validators/DiscordUser";
import type { DiscordUserGuild } from "@mc/validators/DiscordUserGuilds";
import { REST } from "@discordjs/rest";
import { PermissionFlagsBits, Routes } from "discord-api-types/v10";

import { BitField } from "@mc/common/BitField";
import { DiscordUserSchema } from "@mc/validators/DiscordUser";
import { DiscordUserGuildsSchema } from "@mc/validators/DiscordUserGuilds";

function createClient(token: string) {
  return new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(token);
}

export const DiscordService = {
  async identify(token: string): Promise<DiscordUser> {
    const client = createClient(token);

    const user = await client.get(Routes.user());

    return DiscordUserSchema.parse(user);
  },

  async userGuilds(
    token: string,
  ): Promise<{ userGuilds: Map<string, DiscordUserGuild> }> {
    const client = createClient(token);

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
