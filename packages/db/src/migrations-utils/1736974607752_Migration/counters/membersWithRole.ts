import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId, MembersFilterStatus } from "../types/DataSource";

const MembersWithRoleCounter: ConvertCounter = {
  aliases: [
    "membersWithRole",
    "onlineMembersWithRole",
    "offlineMembersWithRole",
  ],
  convert: ({ format, args, aliasUsed }) => {
    const targetRoles: string[] = args[0] ?? [];

    return {
      id: DataSourceId.MEMBERS,
      format,
      options: {
        roles: targetRoles,
        statusFilter: aliasUsed.startsWith("online")
          ? MembersFilterStatus.ONLINE
          : aliasUsed.startsWith("offline")
            ? MembersFilterStatus.OFFLINE
            : MembersFilterStatus.ANY,
      },
    };
  },
};

export default MembersWithRoleCounter;
