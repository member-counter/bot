import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const RolesCounter: ConvertCounter = {
  aliases: ["roles"],
  convert: ({ format }) => {
    return {
      id: DataSourceId.ROLES,
      format,
    };
  },
};

export default RolesCounter;
