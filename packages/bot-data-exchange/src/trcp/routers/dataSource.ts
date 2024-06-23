import { ChannelType } from "discord.js";
import { z } from "zod";

import DataSourceService from "@mc/common/DataSourceService/index";
import { GuildSettings } from "@mc/common/GuildSettings";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { advertiseEvaluatorPriorityKey } from "@mc/common/redis/keys";

export const dataSourceRouter = createTRPCRouter({
  computeTemplate: publicProcedure
    .input(
      z.object({
        template: z.string(),
        guildId: z.string(),
        channelId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { botClient, redisClient } = ctx;
      const guild = botClient.guilds.cache.get(input.guildId);
      if (!guild) return;

      const handledPriority = Number(
        await redisClient.get(advertiseEvaluatorPriorityKey(guild.id)),
      );

      if (handledPriority > botClient.botInstanceOptions.dataSourceComputePriority) return;

      await ctx.lockRequest();

      const guildSettings = await GuildSettings.upsert(guild.id);
      const channel = guild.channels.cache.get(input.channelId);

      const dataSourceService = new DataSourceService({
        guild: guild,
        guildSettings,
        channelType: channel?.type ?? ChannelType.GuildText,
      });

      const computedTemplate = await dataSourceService.evaluateTemplate(
        input.template,
      );

      return computedTemplate;
    }),
});
