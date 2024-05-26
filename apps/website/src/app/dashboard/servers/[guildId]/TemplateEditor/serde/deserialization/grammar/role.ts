import type { Grammar } from "prismjs";

export const roleGrammar: Grammar = {
  role: {
    // <@&id>
    pattern: /<@&\d+>/,
    lookbehind: true,
    greedy: true,
    inside: {
      id: {
        pattern: /(^<@&)\d+(?=>$)/,
        lookbehind: true,
      },
      punctuation: /<@&|>/,
    },
  },
};
