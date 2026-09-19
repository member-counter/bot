/* eslint-disable no-control-regex */
import type { Grammar } from "prismjs";

export const dataSourceGrammar: Grammar = {
  dataSource: {
    pattern: /\u001F[^\u001F]*\u001F/,
    lookbehind: true,
    greedy: true,
    inside: {
      definition: {
        pattern: /(^\u001F)[^\u001F]*(?=\u001F$)/,
        lookbehind: true,
      },
      punctuation: /\u001F/,
    },
  },
};
