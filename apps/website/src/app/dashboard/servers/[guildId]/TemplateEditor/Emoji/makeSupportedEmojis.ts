import fs from "fs/promises";
import path from "path";
import Twemoji from "@twemoji/api";

import EmojiData from "./unicode-emoji-json/data-by-emoji.json";

console.log("Updating supported emojis...");

const supportedEmojis = {} as Record<
  string,
  {
    name: string;
    slug: string;
    group: string;
    skin_tone_support: boolean;
  }
>;

async function exists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

// TODO figure out where the emoji numbers went

for (const [emoji, emojiData] of Object.entries(EmojiData)) {
  const codePoint = Twemoji.convert.toCodePoint(emoji);
  const emojiPath = `${path.join(import.meta.dirname, "twemoji", "assets", "72x72", codePoint)}.png`;

  if (!(await exists(emojiPath))) continue;

  supportedEmojis[emoji] = emojiData;
}

const fileContent = `
export const supportedEmojis = ${JSON.stringify(supportedEmojis)} as Record<
  string,
  {
    name: string;
    slug: string;
    group: string;
    skin_tone_support: boolean;
  }
>;
`;

fs.writeFile(path.join(import.meta.dirname, "supportedEmojis.ts"), fileContent);

console.log("Supported emojis updated");
