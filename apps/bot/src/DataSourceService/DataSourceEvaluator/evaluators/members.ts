import type { PresenceStatus } from "discord.js";

import {
  DataSourceId,
  MembersFilterAccountType,
  MembersFilterStatus,
} from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

const PresenceStatusMap: Record<PresenceStatus, MembersFilterStatus> = {
  offline: MembersFilterStatus.OFFLINE,
  invisible: MembersFilterStatus.OFFLINE,
  dnd: MembersFilterStatus.DND,
  idle: MembersFilterStatus.IDLE,
  online: MembersFilterStatus.ONLINE,
};

export const membersDataSourceEvaluator = new DataSourceEvaluator({
  id: DataSourceId.MEMBERS,
  async execute({
    ctx,
    options: {
      accountTypeFilter,
      bannedMembers,
      connectedTo,
      playing,
      roleFilterMode,
      roles,
      statusFilter,
    },
  }) {
    if (bannedMembers) {
      return (await ctx.guild.bans.fetch()).size;
    }

    const filteredMembers = (await ctx.guild.members.fetch()).clone();

    if (statusFilter)
      for (const [id, member] of filteredMembers) {
        if (
          PresenceStatusMap[member.presence?.status ?? "offline"] !=
          statusFilter
        )
          filteredMembers.delete(id);
      }

    if (accountTypeFilter)
      for (const [id, member] of filteredMembers) {
        if (
          (!member.user.bot &&
            accountTypeFilter === MembersFilterAccountType.BOT) ||
          (member.user.bot &&
            accountTypeFilter === MembersFilterAccountType.USER)
        )
          filteredMembers.delete(id);
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

    return filteredMembers.size;
  },
});
