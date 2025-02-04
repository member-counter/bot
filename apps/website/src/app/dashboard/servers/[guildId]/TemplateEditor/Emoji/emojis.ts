import type { Searchable } from "~/app/components/Combobox";
import { supportedEmojis } from "./supportedEmojis";

export const emojis = supportedEmojis;
export const emojisEntries = Object.entries(emojis);
export const emojisKeys = Object.keys(emojis);

export const availableSkinTones = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

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
