import twemoji from "@twemoji/api";

import type { Searchable } from "~/app/components/Combobox";
import { supportedEmojis } from "./supportedEmojis";

export const emojis = supportedEmojis;
export const emojisEntries = Object.entries(emojis);
export const emojisKeys = Object.keys(emojis);

export const availableSkinTones = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

export function applySkinTone(emoji: string, skinTone: string) {
  if (skinTone === "") return emoji;

  const emojiCodePoint = twemoji.convert.toCodePoint(emoji);
  const skinToneCodePoint = twemoji.convert.toCodePoint(skinTone);

  const emojiCodePointSegments = emojiCodePoint.split("-");
  emojiCodePointSegments.splice(1, 0, skinToneCodePoint);

  return emojiCodePointSegments
    .map((segment) => twemoji.convert.fromCodePoint(segment))
    .join("");
}

export const emojisByGroup = emojisEntries.reduce(
  (groupedEmojis, [emoji, emojiData]) => {
    groupedEmojis[emojiData.group] ??= [];
    groupedEmojis[emojiData.group]?.push(emoji);
    return groupedEmojis;
  },
  {} as Record<string, string[]>,
);

export const searchableEmojis: Searchable<string>[] = emojisEntries.map(
  ([emoji, { name }]) => ({ value: emoji, keywords: name.split(" ") }),
);
