import { ChannelType } from "discord.js";
import { z } from "zod";

import DataSourceService from "@mc/services/DataSource/index";
import { GuildSettingsService } from "@mc/services/guildSettings";

import { checkPriority } from "../../checkPriority";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
      const { botClient } = ctx;
      const guild = botClient.guilds.cache.get(input.guildId);

      if (!guild) {
        await ctx.dropRequest();
        return;
      }

      const hasPriority = await checkPriority(guild, ctx);

      if (!hasPriority) {
        await ctx.dropRequest();
        return;
      }

      await ctx.lockRequest();

      const guildSettings = await GuildSettingsService.upsert(guild.id);
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
