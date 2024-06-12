import type {
  Collection,
  PresenceStatus,
  TextBasedChannel,
  VoiceBasedChannel,
} from "discord.js";
import { ChannelType } from "discord.js";

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
            if (!member.roles.cache.has(roleId)) {
              filteredMembers.delete(id);
              break;
            }
          }
        }
      } /* mode is OR */ else {
        for (const [id, member] of filteredMembers) {
          let hasSome = false;

          for (const roleId of options.roles) {
            if (member.roles.cache.has(roleId)) {
              hasSome = true;
              break;
            }
          }

          if (!hasSome) filteredMembers.delete(id);
        }
      }
    }

    if (options.playing?.length) {
      const games = options.playing.map((game) => game.trim().toLowerCase());

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

    // TODO add members conneced
    // if (options.connectedTo) {
    //   const channels = ctx.guild.channels.cache.filter((channel) =>
    //     options.connectedTo.includes(channel.id),
    //   );

    //   for (const [id] of filteredMembers) {
    //     let hasSome = false;

    //     channels: for (const [id, channel] of channels) {
    //       if (channel.isVoiceBased()) {
    //         channel.members.has(id);
    //         hasSome = true;
    //         break channels;
    //       }
    //     }

    //     if (!hasSome) filteredMembers.delete(id);
    //   }
    // }

    return filteredMembers.size;
  },
});
