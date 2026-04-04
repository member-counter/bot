import { z } from "zod";

import {
  CachedDiscordUserValidator,
  DISCORD_USER_CACHE_TTL,
} from "@mc/common/redis/DiscordUserCache";
import { discordUserCacheKey } from "@mc/common/redis/keys";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const discordRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await ctx.takeRequest(true);
      const cacheKey = discordUserCacheKey(input.id);

      // Try to get from cache first
      const cached = await ctx.redisClient.get(cacheKey);
      if (cached) {
        try {
          const parsed = CachedDiscordUserValidator.parse(JSON.parse(cached));
          return parsed;
        } catch {
          // If validation fails, delete the invalid cache entry
          await ctx.redisClient.del(cacheKey);
        }
      }

      const user = await ctx.botClient.users.fetch(input.id);

      const userData = {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.displayAvatarURL(),
      } satisfies z.infer<typeof CachedDiscordUserValidator>;

      // Cache the result
      await ctx.redisClient.setex(
        cacheKey,
        DISCORD_USER_CACHE_TTL,
        JSON.stringify(userData),
      );

      return userData;
    }),

  getGuild: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await ctx.takeRequest(ctx.botClient.guilds.cache.has(input.id));

      const guild = await ctx.botClient.guilds.fetch({
        guild: input.id,
      });

      const guildMember = await guild.members.fetchMe();

      return {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        rulesChannelId: guild.rulesChannelId,
        roles: new Map(
          guild.roles.cache.mapValues((role) => ({
            id: role.id,
            name: role.name,
            color: role.color,
          })),
        ),
        channels: new Map(
          guild.channels.cache.mapValues((channel) => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            botPermissions: channel
              .permissionsFor(guildMember)
              .bitfield.toString(),
            everyonePermissions: channel
              .permissionsFor(guild.roles.everyone)
              .bitfield.toString(),
            position: "position" in channel && channel.position,
            parentId: channel.parentId,
          })),
        ),
        emojis: new Map(
          guild.emojis.cache.mapValues((emoji) => ({
            id: emoji.id,
            name: emoji.name,
            animated: emoji.animated,
          })),
        ),
      };
    }),

  getGuildMember: publicProcedure
    .input(z.object({ guildId: z.string(), memberId: z.string() }))
    .query(async ({ ctx, input }) => {
      await ctx.takeRequest(ctx.botClient.guilds.cache.has(input.guildId));

      const guild = await ctx.botClient.guilds.fetch({
        guild: input.guildId,
      });

      const guildMember = await guild.members.fetch({ user: input.memberId });

      return {
        id: guildMember.id,
        permissions: guildMember.permissions.bitfield.toString(),
      };
    }),
});
