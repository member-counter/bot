import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const discordRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await ctx.lockRequest();

      const user = await ctx.botClient.users.fetch(input.id);

      return {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.displayAvatarURL(),
      };
    }),
  getGuild: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.botClient.guilds.cache.has(input.id)) await ctx.dropRequest();

      await ctx.lockRequest();

      const guild = await ctx.botClient.guilds.fetch({
        guild: input.id,
        withCounts: true,
      });

      const guildMember = guild.members.me;

      if (!guildMember) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        memberCount: guild.memberCount,
        approximateMemberCount: guild.approximateMemberCount,
        roles: guild.roles.cache.map((role) => ({
          id: role.id,
          name: role.name,
          color: role.color,
        })),
        channels: guild.channels.cache.map((channel) => ({
          id: channel.id,
          name: channel.name,
          type: channel.type,
          botPermissions: channel
            .permissionsFor(guildMember)
            .bitfield.toString(),
        })),
        emojis: guild.emojis.cache.map((emoji) => ({
          id: emoji.id,
          name: emoji.name,
          animated: emoji.animated,
        })),
      };
    }),
});
