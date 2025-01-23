import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const MembersConnectedCounter: ConvertCounter = {
  aliases: ["connectedMembers", "membersConnected"],
  convert: ({ format, args }) => {
    const targetChannels = args[0] ?? [];

    return {
      id: DataSourceId.MEMBERS,
      format,
      options: {
        connectedTo: targetChannels,
      },
    };
  },
};

export default MembersConnectedCounter;
