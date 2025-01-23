import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId, MembersFilterStatus } from "../types/DataSource";

const MembersOnlineApproximatedCounter: ConvertCounter = {
  aliases: ["approximatedOnlineMembers"],
  convert: ({ format }) => {
    return {
      id: DataSourceId.MEMBERS,
      format,
      options: {
        statusFilter: MembersFilterStatus.ONLINE,
      },
    };
  },
};

export default MembersOnlineApproximatedCounter;
