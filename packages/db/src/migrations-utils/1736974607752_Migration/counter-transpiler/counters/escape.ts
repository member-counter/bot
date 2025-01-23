import type ConvertCounter from "../types/ConvertCounter";
import { toUnparsedArgsCompat } from "../toUnparsedArgsCompat";

const EscapeCounter: ConvertCounter = {
  aliases: ["escape"],
  convert: ({ args }) => {
    const unparsedArgs = toUnparsedArgsCompat(args);
    return unparsedArgs;
  },
};

export default EscapeCounter;
