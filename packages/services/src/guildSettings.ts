import { getChannelLogs, setChannelLog } from "@mc/common/redis/ChannelLogs";
import { db, throwNotFoundOrThrow } from "@mc/db";

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
    get: async (discordChannelId: string, discordGuildId: string) => {
      return await db.channel.upsert({
        create: { discordChannelId, discordGuildId },
        update: {},
        where: { discordChannelId, discordGuildId },
      });
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
      return await db.channel.upsert({
        create: data,
        update: data,
        where: {
          discordChannelId: data.discordChannelId,
          discordGuildId: data.discordGuildId,
        },
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
