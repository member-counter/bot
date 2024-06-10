import type { PresenceStatus } from "discord.js";
import { ActivityType } from "discord.js";

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
          member.user.bot &&
          options.accountTypeFilter === MembersFilterAccountType.BOT
        )
          filteredMembers.delete(id);
      }

    if (options.roles) {
      if (options.roleFilterMode /* mode is AND */) {
        for (const [id, member] of filteredMembers) {
          root: for (const roleId of options.roles) {
            for (const [memberRoleId] of member.roles.cache) {
              if (memberRoleId !== roleId) {
                filteredMembers.delete(id);
                break root;
              }
            }
          }
        }
      } /* mode is OR */ else {
        for (const [id, member] of filteredMembers) {
          let hasSome = false;

          root: for (const roleId of options.roles) {
            for (const [memberRoleId] of member.roles.cache) {
              if (memberRoleId === roleId) {
                hasSome = true;
                break root;
              }
            }
          }

          if (!hasSome) filteredMembers.delete(id);
        }
      }
    }

    if (options.playing) {
      const games = (options.playing as string[]).map((game) =>
        game.trim().toLowerCase(),
      );

      for (const [id, member] of filteredMembers) {
        let hasSome = false;

        root: for (const game of games) {
          for (const activity of member.presence?.activities ?? []) {
            if (
              activity.type === ActivityType.Playing &&
              activity.name.toLowerCase().includes(game)
            ) {
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
