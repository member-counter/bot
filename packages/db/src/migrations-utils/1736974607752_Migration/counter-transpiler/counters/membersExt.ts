import type ConvertCounter from "../types/ConvertCounter";
import {
  DataSourceId,
  MembersFilterAccountType,
  MembersFilterStatus,
} from "../types/DataSource";

const MembersExtendedCounter: ConvertCounter = {
  aliases: [
    "bots",
    "users",
    "onlinemembers",
    "offlinemembers",
    "onlineusers",
    "offlineusers",
    "onlinebots",
    "offlinebots",
  ],
  convert: ({ format, aliasUsed }) => {
    return {
      id: DataSourceId.MEMBERS,
      format,
      options: {
        accountTypeFilter: aliasUsed.includes("bot")
          ? MembersFilterAccountType.BOT
          : aliasUsed.includes("user")
            ? MembersFilterAccountType.USER
            : MembersFilterAccountType.ANY,
        statusFilter: aliasUsed.startsWith("online")
          ? MembersFilterStatus.ONLINE
          : aliasUsed.startsWith("offline")
            ? MembersFilterStatus.OFFLINE
            : MembersFilterStatus.ANY,
      },
    };
  },
};

export default MembersExtendedCounter;
