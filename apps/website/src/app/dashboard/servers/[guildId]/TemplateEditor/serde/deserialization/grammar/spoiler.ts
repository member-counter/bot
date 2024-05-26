import type { Grammar } from "prismjs";

import { createInline } from "../createInLine";

export const spoilerGrammar: Grammar = {
  spoiler: {
    // ||spoiler||
    pattern: createInline(/(\|\|)(?:(?!\|)<inner>)+\2/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^\|\|)[\s\S]+(?=\1$)/,
        lookbehind: true,
        inside: {}, // see below
      },
      punctuation: /\|\|/,
    },
  },
};
