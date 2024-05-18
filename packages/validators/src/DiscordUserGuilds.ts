import { CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";
import { z } from "zod";

export type DiscordUserGuild = z.infer<typeof DiscordUserGuildSchema>;
export const DiscordUserGuildSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    icon: z.string().nullable(),
    permissions: z.string(),
    approximate_member_count: z.number(),
    approximate_presence_count: z.number(),
  })
  .transform((guild) => {
    const icon =
      guild.icon &&
      RouteBases.cdn +
        "/" +
        CDNRoutes.guildIcon(
          guild.id,
          guild.icon,
          guild.icon.startsWith("a_") ? ImageFormat.GIF : ImageFormat.JPEG,
        ) +
        "?size=64";
    return {
      id: guild.id,
      name: guild.name,
      icon,
      permissions: guild.permissions,
      approximateMemberCount: guild.approximate_member_count,
      approximatePresenceCount: guild.approximate_presence_count,
    };
  });

export type DiscordUserGuilds = z.infer<typeof DiscordUserGuildsSchema>;
export const DiscordUserGuildsSchema = z.array(DiscordUserGuildSchema);
