import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId } from "../types/DataSource";

const ReplaceCounter: ConvertCounter = {
  aliases: ["replace"],
  convert: ({ args, format }) => {
    const [unparsedText, unparsedPairs] = args;

    const text = unparsedText?.[0];
    const pairs = unparsedPairs?.map((pair) => pair.split(/(?<!\\);/));

    return {
      id: DataSourceId.REPLACE,
      format,
      options: {
        text,
        replacements: pairs?.map(([search, replacement]) => ({
          search,
          replacement,
        })),
      },
    };
  },
};

export default ReplaceCounter;
