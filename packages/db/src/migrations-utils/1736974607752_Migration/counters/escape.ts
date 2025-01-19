import type ConvertCounter from "../types/ConvertCounter";

const EscapeCounter: ConvertCounter = {
  aliases: ["escape"],
  convert: ({ unparsedArgs }) => {
    return unparsedArgs;
  },
};

export default EscapeCounter;
