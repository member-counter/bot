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
      await ctx.lockRequest();

      const guild = await ctx.botClient.guilds.fetch({
        guild: input.id,
        withCounts: true,
      });

      return {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        memberCount: guild.memberCount,
        approximateMemberCount: guild.approximateMemberCount,
      };
    }),
});
