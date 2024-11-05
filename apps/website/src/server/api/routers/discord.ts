import { z } from "zod";

import { botDataExchangeConsumer } from "@mc/services/botDataExchange/botDataExchangeConsumer";
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
      return botDataExchangeConsumer.discord.getUser.query({ id });
    }),
  getGuild: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id } }) => {
      return botDataExchangeConsumer.discord.getGuild.query({ id });
    }),

  getGuildMember: protectedProcedure
    .input(z.object({ guildId: z.string(), memberId: z.string() }))
    .query(({ input: { guildId, memberId } }) => {
      return botDataExchangeConsumer.discord.getGuildMember.query({
        guildId,
        memberId,
      });
    }),
});
