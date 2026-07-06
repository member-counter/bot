import type { Channel } from "@mc/db";

import { getChannelLogs, setChannelLog } from "@mc/common/redis/ChannelLogs";
import { db, NotFoundError, throwNotFoundOrThrow } from "@mc/db";

// A syntactically valid ObjectId used only for the in-memory default returned
// by channels.get when no settings row exists yet. It is never written to the
// DB and never read by callers (the dashboard form keys on the route
// channelId, and channels.update upserts by discordChannelId), so a constant
// placeholder is enough to satisfy the Channel shape.
const PLACEHOLDER_CHANNEL_ID = "000000000000000000000000";

export type GuildSettingsData = Awaited<
  ReturnType<typeof GuildSettingsService.get>
>;

export const GuildSettingsService = {
  upsert: async (
    discordGuildId: string,
    data?: Parameters<typeof db.guild.upsert>[0]["update"],
  ) => {
    return await db.guild.upsert({
      create: { discordGuildId, formatSettings: {} },
      where: { discordGuildId },
      update: data ?? {},
    });
  },

  get: async (discordGuildId: string) => {
    return await db.guild
      .findUniqueOrThrow({
        where: { discordGuildId },
      })
      .catch(throwNotFoundOrThrow);
  },

  getMany: async (discordGuildIds: string[]) => {
    return await db.guild.findMany({
      where: { discordGuildId: { in: discordGuildIds } },
    });
  },

  reset: async (discordGuildId: string) => {
    await db.guild.delete({
      where: { discordGuildId },
    });

    await GuildSettingsService.upsert(discordGuildId);
  },

  has: async (discordGuildId: string) => {
    return !!(await db.guild.findUnique({
      where: { discordGuildId },
      select: { id: true },
    }));
  },

  isBlocked: async (discordGuildId: string) => {
    return await db.blockedGuild.findUnique({
      where: { discordGuildId },
    });
  },

  areBlocked: async (discordGuildIds: string[]) => {
    return await db.blockedGuild.findMany({
      where: { discordGuildId: { in: discordGuildIds } },
    });
  },

  updateBlock: async (
    discordGuildId: string,
    isBlocked: boolean,
    reason?: string,
  ) => {
    if (isBlocked) {
      await db.blockedGuild.create({
        data: {
          discordGuildId,
          reason: reason ?? "",
        },
      });
    } else {
      await db.blockedGuild.delete({
        where: { discordGuildId },
      });
    }
  },

  channels: {
    get: async (
      discordChannelId: string,
      discordGuildId: string,
    ): Promise<Channel> => {
      const channel = await db.channel.findUnique({
        where: { discordChannelId },
      });

      if (channel) return channel;

      // No settings row exists for this channel yet. This is a hot read path
      // (the dashboard channel settings form), so instead of writing a row on
      // read (what the old upsert did) we return an in-memory default matching
      // what a freshly created row would look like. channels.update lazily
      // creates the real row on first save. Field values mirror the Channel
      // model defaults (empty template, template disabled).
      return {
        id: PLACEHOLDER_CHANNEL_ID,
        discordChannelId,
        template: "",
        isTemplateEnabled: false,
        discordGuildId,
      };
    },

    getAll: async (discordGuildId: string) => {
      return await db.channel.findMany({
        where: { discordGuildId },
      });
    },

    getAllEnabledTempaltes: async (discordGuildIds: string[]) => {
      return await db.channel.findMany({
        where: {
          discordGuildId: { in: discordGuildIds },
          isTemplateEnabled: true,
        },
        select: {
          discordGuildId: true,
          discordChannelId: true,
          template: true,
        },
      });
    },

    update: async (
      data: Parameters<typeof db.channel.upsert>[0]["create"] & {
        discordChannelId: string;
        discordGuildId: string;
      },
    ) => {
      // A channel belongs to exactly one guild for its whole life, so its
      // discordGuildId is immutable. Reject a caller trying to touch a channel
      // that already belongs to another guild — otherwise, since the row is
      // matched by the globally-unique discordChannelId, an admin of guild B
      // could overwrite (or relocate) a channel configured under guild A.
      const existing = await db.channel.findUnique({
        where: { discordChannelId: data.discordChannelId },
        select: { discordGuildId: true },
      });

      if (existing && existing.discordGuildId !== data.discordGuildId)
        throw new NotFoundError();

      return await db.channel.upsert({
        create: data,
        // never rewrite discordGuildId on an existing row
        update: {
          template: data.template,
          isTemplateEnabled: data.isTemplateEnabled,
        },
        where: {
          discordChannelId: data.discordChannelId,
        },
      });
    },

    disableTemplate: async (discordChannelId: string) => {
      return await db.channel.update({
        where: { discordChannelId },
        data: { isTemplateEnabled: false },
      });
    },

    delete: async (discordChannelId: string) => {
      await db.channel.delete({
        where: { discordChannelId },
      });
    },

    logs: {
      set: async (...args: Parameters<typeof setChannelLog>) => {
        return await setChannelLog(...args);
      },
      get: async (...args: Parameters<typeof getChannelLogs>) => {
        return await getChannelLogs(...args);
      },

      getAll: async (discordGuildId: string) => {
        const { channels } = await db.guild.findUniqueOrThrow({
          where: { discordGuildId },
          select: { channels: { select: { discordChannelId: true } } },
        });

        const channelLogs = await Promise.all(
          channels.map(async ({ discordChannelId }) => ({
            discordChannelId,
            logs: await getChannelLogs(discordChannelId),
          })),
        );

        const channelLogsMap = new Map(
          channelLogs.map(({ discordChannelId, logs }) => [
            discordChannelId,
            logs,
          ]),
        );

        return channelLogsMap;
      },
    },
  },
};
