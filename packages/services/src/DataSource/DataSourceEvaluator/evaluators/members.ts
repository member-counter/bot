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
      if (statusFilter === MembersFilterStatus.ONLINE) {
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

const executePrivilegedSearch: DataSourceEvaluator<DataSourceId.MEMBERS>["execute"] =
  ({
    ctx,
    options: {
      accountTypeFilter,
      connectedTo,
      playing,
      roleFilterMode,
      roles,
      statusFilter,
    },
  }) => {
    const filteredMembers = ctx.guild.members.cache.clone();

    if (connectedTo?.length) {
      const channels = ctx.guild.channels.cache.filter((channel) =>
        connectedTo.includes(channel.id),
      );

      for (const [id] of filteredMembers) {
        let hasSome = false;

        channels: for (const [_, channel] of channels) {
          if (channel.isVoiceBased() && channel.members.has(id)) {
            hasSome = true;
            break channels;
          }
        }

        if (!hasSome) filteredMembers.delete(id);
      }
    }

    if (statusFilter) {
      for (const [id, member] of filteredMembers) {
        if (
          PresenceStatusMap[member.presence?.status ?? "offline"] !=
          statusFilter
        )
          filteredMembers.delete(id);
      }
    }

    if (accountTypeFilter) {
      for (const [id, member] of filteredMembers) {
        if (
          (!member.user.bot &&
            accountTypeFilter === MembersFilterAccountType.BOT) ||
          (member.user.bot &&
            accountTypeFilter === MembersFilterAccountType.USER)
        )
          filteredMembers.delete(id);
      }
    }

    if (roles?.length) {
      if (/* mode is AND */ roleFilterMode) {
        for (const [id, member] of filteredMembers) {
          for (const roleId of roles) {
            if (!member.roles.cache.has(roleId)) {
              filteredMembers.delete(id);
              break;
            }
          }
        }
      } /* mode is OR */ else {
        for (const [id, member] of filteredMembers) {
          let hasSome = false;

          for (const roleId of roles) {
            if (member.roles.cache.has(roleId)) {
              hasSome = true;
              break;
            }
          }

          if (!hasSome) filteredMembers.delete(id);
        }
      }
    }

    if (playing?.length) {
      const games = playing.map((game) => game.trim().toLowerCase());

      for (const [id, member] of filteredMembers) {
        let hasSome = false;

        games: for (const game of games) {
          for (const activity of member.presence?.activities ?? []) {
            if (activity.name.toLowerCase().includes(game)) {
              hasSome = true;
              break games;
            }
          }
        }

        if (!hasSome) filteredMembers.delete(id);
      }
    }

    return filteredMembers.size;
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
