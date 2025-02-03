import type { Searchable } from "~/app/components/Combobox";
import { supportedEmojis } from "./supportedEmojis";

export const emojis = supportedEmojis;

export function getEmojiData(emoji: string) {
  return Object.entries(emojis).find(
    ([maybeEmoji]) => maybeEmoji === emoji,
  )?.[1];
}

export const availableSkinTones = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

export const emojisByGroup = Object.entries(emojis).reduce(
  (groupedEmojis, [emoji, emojiData]) => {
    groupedEmojis[emojiData.group] ??= [];
    groupedEmojis[emojiData.group]?.push(emoji);
    return groupedEmojis;
  },
  {} as Record<string, string[]>,
);

export const searchableEmojis: Searchable<string>[] = Object.entries(
  emojis,
).map(([emoji, { name }]) => ({ value: emoji, keywords: name.split(" ") }));
