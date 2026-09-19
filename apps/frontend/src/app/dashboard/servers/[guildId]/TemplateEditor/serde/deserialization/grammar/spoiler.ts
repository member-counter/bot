import type { Grammar } from "prismjs";

export const spoilerGrammar: Grammar = {
  spoiler: {
    // ||spoiler||
    pattern: /(\|\|)(?:(?!\|)[\s\S])+\1/,
    greedy: true,
    inside: {
      content: {
        pattern: /(^\|\|)[\s\S]+(?=\1$)/,
        lookbehind: true,
        greedy: true,
        inside: {},
      },
      punctuation: /\|\|/,
    },
  },
};
