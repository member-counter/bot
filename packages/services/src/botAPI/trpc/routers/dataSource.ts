import assert from "node:assert";
import { TRPCError } from "@trpc/server";
import { ChannelType } from "discord.js";
import { z } from "zod";

import DataSourceService from "@mc/services/DataSource/index";
import { GuildSettingsService } from "@mc/services/guildSettings";

import { checkPriority } from "../../checkPriority";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const dataSourceRouter = createTRPCRouter({
  testFetchUrl: publicProcedure
    .input(z.object({ url: z.url() }))
    .query(async ({ input, ctx }) => {
      await ctx.takeRequest(true);

      const response = await fetch(input.url, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "Member Counter Discord Bot",
        },
      }).catch((e) => {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: e instanceof Error ? e.message : "Fetch failed",
        });
      });

      if (response.status !== 200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `HTTP ${response.status} ${response.statusText}`,
        });
      }

      return response.text();
    }),
  computeTemplate: publicProcedure
    .input(
      z.object({
        template: z.string(),
        guildId: z.string(),
        channelId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { botClient } = ctx;
      const guild = botClient.guilds.cache.get(input.guildId);
      const hasPriority = !!guild && (await checkPriority(guild, ctx));

      await ctx.takeRequest(hasPriority);

      assert(guild);

      const guildSettings = await GuildSettingsService.upsert(guild.id);
      const channel = guild.channels.cache.get(input.channelId);

      const dataSourceService = new DataSourceService({
        guild: guild,
        guildSettings,
        channelType: channel?.type ?? ChannelType.GuildText,
      });

      const { result, nonFatalErrors } =
        await dataSourceService.evaluateTemplate(input.template);

      return {
        result,
        nonFatalErrors: nonFatalErrors.map((error) => error.message),
      };
    }),
});
