import { ChannelType } from "discord.js";

import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const channelEvaluator = new DataSourceEvaluator({
  id: DataSourceId.CHANNELS,
  execute({ ctx, options }) {
    const targetCategories = (options.categories ?? []) as string[];

    if (targetCategories.length) {
      return ctx.guild.channels.cache.filter((channel) =>
        targetCategories.includes(channel.parentId ?? ""),
      ).size;
    } else {
      return ctx.guild.channels.cache.filter(
        (channel) => channel.type !== ChannelType.GuildCategory,
      ).size;
    }
  },
});
