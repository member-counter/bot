/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Grammar } from "prismjs";

export function applyRecursivePatterns(grammar: Grammar) {
  grammar = structuredClone(grammar);
  Object.keys(grammar).forEach(function (token) {
    Object.keys(grammar).forEach(function (inside) {
      if (
        token !== inside &&
        //@ts-ignore
        grammar[token].inside?.content?.inside
      ) {
        //@ts-ignore
        grammar[token].inside.content.inside[inside] =
          //@ts-ignore
          grammar[inside];
      }
    });
  });

  return grammar;
}
