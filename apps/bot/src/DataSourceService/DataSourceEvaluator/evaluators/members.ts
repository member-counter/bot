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

export const memberDataSourceEvaluator = new DataSourceEvaluator({
  id: DataSourceId.MEMBERS,
  async execute({ ctx, options }) {
    if (options.bannedMembers) {
      return (await ctx.guild.bans.fetch()).size;
    }

    const filteredMembers = (await ctx.guild.members.fetch()).clone();

    if (options.statusFilter)
      for (const [id, member] of filteredMembers) {
        if (
          PresenceStatusMap[member.presence?.status ?? "offline"] !=
          options.statusFilter
        )
          filteredMembers.delete(id);
      }

    if (options.accountTypeFilter)
      for (const [id, member] of filteredMembers) {
        if (
          (!member.user.bot &&
            options.accountTypeFilter === MembersFilterAccountType.BOT) ||
          (member.user.bot &&
            options.accountTypeFilter === MembersFilterAccountType.USER)
        )
          filteredMembers.delete(id);
      }

    if (options.roles?.length) {
      if (/* mode is AND */ options.roleFilterMode) {
        for (const [id, member] of filteredMembers) {
          for (const roleId of options.roles) {
            if (!member.roles.cache.has(roleId as string)) {
              filteredMembers.delete(id);
              break;
            }
          }
        }
      } /* mode is OR */ else {
        for (const [id, member] of filteredMembers) {
          let hasSome = false;

          for (const roleId of options.roles) {
            if (member.roles.cache.has(roleId as string)) {
              hasSome = true;
              break;
            }
          }

          if (!hasSome) filteredMembers.delete(id);
        }
      }
    }

    if (options.playing?.length) {
      const games = (options.playing as string[]).map((game) =>
        game.trim().toLowerCase(),
      );

      for (const [id, member] of filteredMembers) {
        let hasSome = false;

        root: for (const game of games) {
          for (const activity of member.presence?.activities ?? []) {
            if (activity.name.toLowerCase().includes(game)) {
              hasSome = true;
              break root;
            }
          }
        }

        if (!hasSome) filteredMembers.delete(id);
      }
    }

    return filteredMembers.size;
  },
});
