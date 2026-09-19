import type { Grammar } from "prismjs";

export const channelGrammar: Grammar = {
  channel: {
    // <#id>
    pattern: /<#\d+>/,
    lookbehind: true,
    greedy: true,
    inside: {
      id: {
        pattern: /(^<#)\d+(?=>$)/,
        lookbehind: true,
      },
      punctuation: /<#|>/,
    },
  },
};
