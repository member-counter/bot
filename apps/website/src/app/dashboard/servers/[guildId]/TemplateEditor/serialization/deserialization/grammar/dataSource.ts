/* eslint-disable no-control-regex */

import type { Grammar } from "prismjs";

import { createInline } from "../createInLine";

export const dataSourceGrammar: Grammar = {
  dataSource: {
    // \u001FdataSource\u001F
    pattern: createInline(/(\u001F)(?:(?!\u001F)<inner>)+\2/.source),
    lookbehind: true,
    greedy: false,
    inside: {
      content: {
        pattern: /(^\u001F)[\s\S]+(?=\1$)/,
        lookbehind: true,
      },

      punctuation: /\u001F/,
    },
  },
};
