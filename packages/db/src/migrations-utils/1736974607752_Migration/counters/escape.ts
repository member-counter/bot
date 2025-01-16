import type ConvertCounter from "../types/ConvertCounter";

// TODO
const EscapeCounter: ConvertCounter = {
  aliases: ["escape"],
  convert: ({ unparsedArgs }) => {
    const delimiters = [",", ":", ";"];

    let escapedString = unparsedArgs;

    delimiters.forEach((delimiter) => {
      escapedString = escapedString.replaceAll(delimiter, `\\${delimiter}`);
    });

    return escapedString;
  },
};

export default EscapeCounter;
