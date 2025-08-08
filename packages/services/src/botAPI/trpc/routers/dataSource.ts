import assert from "node:assert";
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

      const computedTemplate = await dataSourceService.evaluateTemplate(
        input.template,
      );

      return computedTemplate;
    }),
});
