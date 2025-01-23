import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const BannedMembersCounter: ConvertCounter = {
  aliases: ["bannedMembers"],
  convert: ({ format }) => {
    return {
      id: DataSourceId.MEMBERS,
      format,
      options: {
        bannedMembers: true,
      },
    };
  },
};

export default BannedMembersCounter;
