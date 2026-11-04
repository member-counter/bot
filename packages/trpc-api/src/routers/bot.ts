import { PermissionFlagsBits } from "discord-api-types/v10";
import { z } from "zod";

import { UserPermissions } from "@mc/common/UserPermissions";
import { botAPIConsumer } from "@mc/services/botAPI/botAPIConsumer";

import { env } from "../env";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { checkUserPermissions } from "../utils/checkUserPermissions";

export const botRouter = createTRPCRouter({
  gamedigGames: protectedProcedure.query(() => {
    return botAPIConsumer.gamedig.getGames.query();
  }),
  testFetchUrl: protectedProcedure
    .input(z.object({ url: z.string().url() }))
    .query(({ input }) => {
      return botAPIConsumer.dataSource.testFetchUrl.query(input);
    }),
  computeTemplate: protectedProcedure
    .input(
      z.object({
        template: z.string(),
        guildId: z.string(),
        channelId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // The preview evaluates the template with the data of this guild. Use
      // the same check as reading the channel settings of the guild.
      await checkUserPermissions(
        ctx,
        { discordGuildId: input.guildId },
        ({ userPermissions, userPermissionsInGuild }) =>
          userPermissions.has(UserPermissions.SeeGuilds) ||
          userPermissionsInGuild.any(
            PermissionFlagsBits.Administrator |
              PermissionFlagsBits.ManageChannels,
          ),
      );

      return botAPIConsumer.dataSource.computeTemplate.query(input);
    }),

  getStatus: publicProcedure.query(async () => {
    return Promise.all(
      env.PUBLIC_BOTS_IDS.map(async (id) => ({
        id,
        stats: await botAPIConsumer.bot.getStats
          .query({ id })
          .catch(() => null),
      })),
    );
  }),

  canBotEditChannel: protectedProcedure
    .input(z.object({ guildId: z.string(), channelId: z.string() }))
    .query(({ input: { guildId, channelId } }) => {
      return botAPIConsumer.bot.canBotEditChannel.query({ guildId, channelId });
    }),
});
