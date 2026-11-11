import type { PresenceStatus } from "discord.js";

import {
  DataSourceId,
  MembersFilterAccountType,
  MembersFilterStatus,
} from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";

import type { DataSourceContext } from "..";
import { DataSourceEvaluator } from "..";

const fetchedGuildsBans = new Set();
const PresenceStatusMap: Record<PresenceStatus, MembersFilterStatus> = {
  offline: MembersFilterStatus.OFFLINE,
  invisible: MembersFilterStatus.OFFLINE,
  dnd: MembersFilterStatus.DND,
  idle: MembersFilterStatus.IDLE,
  online: MembersFilterStatus.ONLINE,
};

const throwAvailabiltyIssue = (ctx: DataSourceContext) => {
  const { isPremium } = ctx.guild.client.botInstanceOptions;

  if (isPremium) throw new KnownError("BOT_HAS_NO_ENOUGH_PRIVILEGED_INTENTS");
  else throw new KnownError("BOT_IS_NOT_PREMIUM");
};

const executeUnprivilegedSearch: DataSourceEvaluator<DataSourceId.MEMBERS>["execute"] =
  ({
    ctx,
    options: { accountTypeFilter, connectedTo, playing, roles, statusFilter },
  }) => {
    let count: number | null = ctx.guild.approximateMemberCount;

    if (statusFilter) {
      if (
        statusFilter === MembersFilterStatus.ONLINE ||
        statusFilter === MembersFilterStatus.ONLINE_IDLE_DND
      ) {
        count = ctx.guild.approximatePresenceCount;
      } else if (statusFilter === MembersFilterStatus.OFFLINE) {
        if (
          ctx.guild.approximateMemberCount !== null &&
          ctx.guild.approximatePresenceCount !== null
        )
          count =
            ctx.guild.approximateMemberCount -
            ctx.guild.approximatePresenceCount;
      } else {
        throwAvailabiltyIssue(ctx);
      }
    }

    if (
      connectedTo?.length ||
      accountTypeFilter ||
      roles?.length ||
      playing?.length
    ) {
      throwAvailabiltyIssue(ctx);
    }

    if (count === null) throw new KnownError("MEMBER_COUNT_NOT_AVAILABLE");

    return count;
  };

// Count the cached members that pass all filters, in one pass and without a
// copy of the member cache. All filters must pass, so their order does not
// change the count.
const executePrivilegedSearch: DataSourceEvaluator<DataSourceId.MEMBERS>["execute"] =
  async ({
    ctx,
    scheduler,
    options: {
      accountTypeFilter,
      connectedTo,
      playing,
      roleFilterMode,
      roles,
      statusFilter,
    },
  }) => {
    // Prepare the values of the filters one time, before the loop.
    let membersInVoiceChannels: Set<string> | null = null;
    if (connectedTo?.length) {
      membersInVoiceChannels = new Set();
      const channels = ctx.guild.channels.cache.filter((channel) =>
        connectedTo.includes(channel.id),
      );
      for (const channel of channels.values()) {
        // channel.members builds a new collection each time, so read it one
        // time for each channel.
        if (!channel.isVoiceBased()) continue;
        for (const memberId of channel.members.keys()) {
          membersInVoiceChannels.add(memberId);
        }
      }
    }

    const games = playing?.length
      ? playing.map((game) => game.trim().toLowerCase())
      : null;

    // Without filters, all cached members count. An unknown account type
    // value does not filter.
    const hasAccountTypeFilter =
      accountTypeFilter === MembersFilterAccountType.BOT ||
      accountTypeFilter === MembersFilterAccountType.USER;
    if (
      !membersInVoiceChannels &&
      !statusFilter &&
      !hasAccountTypeFilter &&
      !roles?.length &&
      !games
    ) {
      return ctx.guild.members.cache.size;
    }

    let count = 0;
    let iteration = 0;

    for (const [id, member] of ctx.guild.members.cache) {
      // Check the clock only every 1024 members, because a check costs time.
      // A small guild never gives a turn.
      if ((++iteration & 1023) === 0 && scheduler.shouldYield()) {
        await scheduler.yield();
      }

      if (membersInVoiceChannels && !membersInVoiceChannels.has(id)) continue;

      if (statusFilter) {
        const presenceStatus =
          PresenceStatusMap[member.presence?.status ?? "offline"];

        if (statusFilter === MembersFilterStatus.ONLINE_IDLE_DND) {
          if (presenceStatus === MembersFilterStatus.OFFLINE) continue;
        } else if (presenceStatus != statusFilter) {
          continue;
        }
      }

      if (
        (accountTypeFilter === MembersFilterAccountType.BOT &&
          !member.user.bot) ||
        (accountTypeFilter === MembersFilterAccountType.USER && member.user.bot)
      ) {
        continue;
      }

      if (roles?.length) {
        const hasRoles = /* mode is AND */ roleFilterMode
          ? roles.every((roleId) => member.roles.cache.has(roleId))
          : /* mode is OR */ roles.some((roleId) =>
              member.roles.cache.has(roleId),
            );
        if (!hasRoles) continue;
      }

      if (games) {
        const activities = member.presence?.activities ?? [];
        const isPlaying = games.some((game) =>
          activities.some((activity) =>
            activity.name.toLowerCase().includes(game),
          ),
        );
        if (!isPlaying) continue;
      }

      count++;
    }

    return count;
  };

export const membersEvaluator = new DataSourceEvaluator({
  id: DataSourceId.MEMBERS,
  async execute(execOpts) {
    const {
      ctx: { guild },
      options: { bannedMembers },
    } = execOpts;

    const { isPrivileged } = guild.client.botInstanceOptions;

    if (bannedMembers) {
      if (!fetchedGuildsBans.has(guild.id)) {
        await guild.bans.fetch();
        fetchedGuildsBans.add(guild.id);
      }
      return guild.bans.cache.size;
    }

    if (isPrivileged) {
      return await executePrivilegedSearch(execOpts);
    } else {
      return await executeUnprivilegedSearch(execOpts);
    }
  },
});
