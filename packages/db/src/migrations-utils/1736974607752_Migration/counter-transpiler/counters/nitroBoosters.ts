import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const NitroBoostersCounter: ConvertCounter = {
  aliases: ["nitro-boosters", "nitroBoosters"],
  convert: ({ format }) => ({ id: DataSourceId.NITRO_BOOSTERS, format }),
};

export default NitroBoostersCounter;
