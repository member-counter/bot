import assert from "assert";
import fs from "fs/promises";
import path from "path";
import Twemoji from "@twemoji/api";
import { Jimp } from "jimp";

import {
  availableSkinTones,
  emojis as emojisMetadata,
  getEmojiData,
} from "./emojis";
import {
  cleanFromVariationSelectors,
  IMAGE_RES,
  IMAGES_PER_ROW,
  indexToCoords,
} from "./twemojiMap";

const emojis = Object.keys(emojisMetadata);

async function exists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

function computeCanvasSize(
  imagesPerRow: number,
  imagesLength: number,
  imageSize: number,
): { width: number; height: number } {
  let rows = Math.floor(imagesLength / imagesPerRow);

  if (imagesLength % imagesPerRow !== 0) {
    rows++;
  }

  return {
    width: imagesPerRow * imageSize,
    height: rows * imageSize,
  };
}

console.log("Generating twemojiMap...");

for (
  let skinToneIndex = 0;
  skinToneIndex < availableSkinTones.length;
  skinToneIndex++
) {
  const skinTone = availableSkinTones[skinToneIndex];
  assert(typeof skinTone === "string");

  const canvas = new Jimp(
    computeCanvasSize(IMAGES_PER_ROW, emojis.length, IMAGE_RES),
  );

  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i];
    assert(emoji);

    const supportsSkintone = getEmojiData(emoji)?.skin_tone_support;

    const codePoint = Twemoji.convert.toCodePoint(
      `${cleanFromVariationSelectors(emoji)}${supportsSkintone ? skinTone : ""}`,
    );
    const emojiPath = `${path.join(import.meta.dirname, "twemoji", "assets", "72x72", codePoint)}.png`;

    if (!(await exists(emojiPath))) continue;

    const emojiCanvas = await Jimp.read(emojiPath);

    emojiCanvas.resize({ w: IMAGE_RES });

    canvas.composite(emojiCanvas, ...indexToCoords(i, IMAGE_RES, canvas.width));
  }

  const emojiMapPath: `${string}.${string}` = `${path.join(import.meta.dirname, "twemojiMaps", "twemojiMap")}${skinToneIndex}.png`;
  await canvas.write(emojiMapPath);

  console.log(
    `twemojiMap ${skinToneIndex + 1} of ${availableSkinTones.length} generated`,
  );
}
