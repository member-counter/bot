import { z } from "zod";

import { botAPIConsumer } from "@mc/services/botAPI/botAPIConsumer";
import { DiscordService } from "@mc/services/discord";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const discordRouter = createTRPCRouter({
  identify: protectedProcedure.query(({ ctx }) => {
    return DiscordService.identify(ctx.session.accessToken);
  }),
  userGuilds: protectedProcedure.query(({ ctx }) => {
    return DiscordService.userGuilds(ctx.session.accessToken);
  }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id } }) => {
      return botAPIConsumer.discord.getUser.query({ id });
    }),
  getGuild: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id } }) => {
      return botAPIConsumer.discord.getGuild.query({ id });
    }),

  getGuildMember: protectedProcedure
    .input(z.object({ guildId: z.string(), memberId: z.string() }))
    .query(({ input: { guildId, memberId } }) => {
      return botAPIConsumer.discord.getGuildMember.query({
        guildId,
        memberId,
      });
    }),
});
