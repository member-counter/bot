import type { BlockedGuild, Channel, Guild } from "@mc/db";

import { getChannelLogs, setChannelLog } from "@mc/common/redis/ChannelLogs";
import { db, NotFoundError, throwNotFoundOrThrow } from "@mc/db";

import { ProcessCache } from "./cache/ProcessCache";

// A syntactically valid ObjectId used only for the in-memory default returned
// by channels.get when no settings row exists yet. It is never written to the
// DB and never read by callers (the dashboard form keys on the route
// channelId, and channels.update upserts by discordChannelId), so a constant
// placeholder is enough to satisfy the Channel shape.
const PLACEHOLDER_CHANNEL_ID = "000000000000000000000000";

// The TTL is only a safety limit. Writes in this file invalidate the entries.
// This data has many reads and few writes, so a long TTL is safe.
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 100_000;

// Key: discordGuildId. Value: null when the guild has no settings row.
const guildCache = new ProcessCache<Guild | null>({
  name: "guild",
  ttlMs: CACHE_TTL_MS,
  maxEntries: CACHE_MAX_ENTRIES,
});

// Key: discordGuildId. Value: null when the guild is not blocked.
const blockedGuildCache = new ProcessCache<BlockedGuild | null>({
  name: "blockedGuild",
  ttlMs: CACHE_TTL_MS,
  maxEntries: CACHE_MAX_ENTRIES,
});

// Key: discordGuildId. Value: all channel settings rows of the guild.
const guildChannelsCache = new ProcessCache<Channel[]>({
  name: "guildChannels",
  ttlMs: CACHE_TTL_MS,
  maxEntries: CACHE_MAX_ENTRIES,
});

const loadGuilds = async (discordGuildIds: string[]) => {
  const rows = await db.guild.findMany({
    where: { discordGuildId: { in: discordGuildIds } },
  });
  const result = new Map<string, Guild | null>(
    discordGuildIds.map((id) => [id, null]),
  );
  rows.forEach((row) => result.set(row.discordGuildId, row));
  return result;
};

const loadBlockedGuilds = async (discordGuildIds: string[]) => {
  const rows = await db.blockedGuild.findMany({
    where: { discordGuildId: { in: discordGuildIds } },
  });
  const result = new Map<string, BlockedGuild | null>(
    discordGuildIds.map((id) => [id, null]),
  );
  rows.forEach((row) => result.set(row.discordGuildId, row));
  return result;
};

const loadGuildChannels = async (discordGuildIds: string[]) => {
  const rows = await db.channel.findMany({
    where: { discordGuildId: { in: discordGuildIds } },
  });
  const result = new Map<string, Channel[]>(
    discordGuildIds.map((id) => [id, []]),
  );
  rows.forEach((row) => result.get(row.discordGuildId)?.push(row));
  return result;
};

const getGuildsChannels = async (discordGuildIds: string[]) => {
  const result = await guildChannelsCache.getMany(
    discordGuildIds,
    loadGuildChannels,
  );
  return [...result.values()].flat();
};

export type GuildSettingsData = Awaited<
  ReturnType<typeof GuildSettingsService.get>
>;

export const GuildSettingsService = {
  upsert: async (
    discordGuildId: string,
    data?: Parameters<typeof db.guild.upsert>[0]["update"],
  ) => {
    const guild = await db.guild.upsert({
      create: { discordGuildId, formatSettings: {} },
      where: { discordGuildId },
      update: data ?? {},
    });
    await guildCache.invalidate([discordGuildId]);
    return guild;
  },

  get: async (discordGuildId: string) => {
    const result = await guildCache.getMany([discordGuildId], loadGuilds);
    const guild = result.get(discordGuildId);
    if (!guild) throw new NotFoundError();
    return guild;
  },

  getMany: async (discordGuildIds: string[]) => {
    const result = await guildCache.getMany(discordGuildIds, loadGuilds);
    return [...result.values()].filter((guild) => guild !== null);
  },

  reset: async (discordGuildId: string) => {
    await db.guild.delete({
      where: { discordGuildId },
    });
    // The delete also removes the channel rows of the guild (cascade).
    await Promise.all([
      guildCache.invalidate([discordGuildId]),
      guildChannelsCache.invalidate([discordGuildId]),
    ]);

    await GuildSettingsService.upsert(discordGuildId);
  },

  has: async (discordGuildId: string) => {
    const result = await guildCache.getMany([discordGuildId], loadGuilds);
    return !!result.get(discordGuildId);
  },

  isBlocked: async (discordGuildId: string) => {
    const result = await blockedGuildCache.getMany(
      [discordGuildId],
      loadBlockedGuilds,
    );
    return result.get(discordGuildId) ?? null;
  },

  areBlocked: async (discordGuildIds: string[]) => {
    const result = await blockedGuildCache.getMany(
      discordGuildIds,
      loadBlockedGuilds,
    );
    return [...result.values()].filter((blocked) => blocked !== null);
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
    await blockedGuildCache.invalidate([discordGuildId]);
  },

  channels: {
    get: async (
      discordChannelId: string,
      discordGuildId: string,
    ): Promise<Channel> => {
      const channels = await getGuildsChannels([discordGuildId]);
      const channel = channels.find(
        (channel) => channel.discordChannelId === discordChannelId,
      );

      // Callers check permissions only for discordGuildId. The list contains
      // only the channels of this guild, so a channel of a different guild is
      // not returned.
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
      return await getGuildsChannels([discordGuildId]);
    },

    getAllEnabledTempaltes: async (discordGuildIds: string[]) => {
      const channels = await getGuildsChannels(discordGuildIds);
      return channels
        .filter((channel) => channel.isTemplateEnabled)
        .map(({ discordGuildId, discordChannelId, template }) => ({
          discordGuildId,
          discordChannelId,
          template,
        }));
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

      const channel = await db.channel.upsert({
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
      await guildChannelsCache.invalidate([channel.discordGuildId]);
      return channel;
    },

    disableTemplate: async (discordChannelId: string) => {
      const channel = await db.channel.update({
        where: { discordChannelId },
        data: { isTemplateEnabled: false },
      });
      await guildChannelsCache.invalidate([channel.discordGuildId]);
      return channel;
    },

    delete: async (discordChannelId: string, discordGuildId: string) => {
      // Match both IDs. Callers check permissions only for discordGuildId.
      await db.channel
        .delete({
          where: { discordChannelId, discordGuildId },
        })
        .catch(throwNotFoundOrThrow);
      await guildChannelsCache.invalidate([discordGuildId]);
    },

    logs: {
      set: async (...args: Parameters<typeof setChannelLog>) => {
        return await setChannelLog(...args);
      },
      get: async (discordChannelId: string, discordGuildId: string) => {
        // Callers check permissions only for discordGuildId. Do not return the
        // logs of a channel that belongs to a different guild.
        const channels = await getGuildsChannels([discordGuildId]);
        const isInGuild = channels.some(
          (channel) => channel.discordChannelId === discordChannelId,
        );

        if (!isInGuild) {
          return {
            LastTemplateComputeError: null,
            LastTemplateUpdateDate: null,
          };
        }

        return await getChannelLogs(discordChannelId);
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
