import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const StaticCounter: ConvertCounter = {
  aliases: ["static"],
  convert: ({ unparsedArgs: value, format }) => {
    return {
      id: DataSourceId.NUMBER,
      format,
      options: {
        number: value,
      },
    };
  },
};

export default StaticCounter;
