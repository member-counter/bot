import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const MemberCounter: ConvertCounter = {
  aliases: ["members", "count"],
  convert: ({ format }) => {
    return {
      id: DataSourceId.MEMBERS,
      format,
    };
  },
};

export default MemberCounter;
