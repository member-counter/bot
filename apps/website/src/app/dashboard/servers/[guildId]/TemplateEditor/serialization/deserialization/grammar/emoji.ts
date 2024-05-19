import type { Grammar } from "prismjs";

export const emojiGrammar: Grammar = {
  emoji: {
    // <a:name:id>|emoji
    pattern: /<a?:.+:\d+>|\p{Emoji}\uFE0F|\p{Emoji_Presentation}/u,
    lookbehind: true,
    greedy: true,
    inside: {
      animated: {
        pattern: /(^<)a?(?=:)/,
        lookbehind: true,
      },
      name: {
        pattern: /(^:).+(?=:\d+>)|\p{Emoji}\uFE0F|\p{Emoji_Presentation}/u,
        lookbehind: true,
      },
      id: {
        pattern: /\d+(?=>)/,
        lookbehind: true,
      },
      punctuation: /<|:|>/,
    },
  },
};
