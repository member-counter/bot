import assert from "assert";
import fs from "fs/promises";
import path from "path";
import { Jimp } from "jimp";

import {
  applySkinTone,
  availableSkinTones,
  emojis as emojisMetadata,
} from "./emojis";
import {
  grabTheRightIcon,
  IMAGE_PADDING,
  IMAGE_RESOLUTION,
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
    computeCanvasSize(IMAGES_PER_ROW, emojis.length, IMAGE_RESOLUTION),
  );

  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i];
    assert(emoji);

    const supportsSkintone = emojisMetadata[emoji]?.skin_tone_support;

    const codePoint = grabTheRightIcon(
      supportsSkintone ? applySkinTone(emoji, skinTone) : emoji,
    );

    const emojiPath = `${path.join(import.meta.dirname, "twemoji", "assets", "72x72", codePoint)}.png`;

    if (!(await exists(emojiPath))) continue;

    const emojiCanvas = await Jimp.read(emojiPath);

    emojiCanvas.resize({ w: IMAGE_RESOLUTION - IMAGE_PADDING });

    const [x, y] = indexToCoords(i, IMAGE_RESOLUTION, canvas.width);

    canvas.composite(emojiCanvas, x + IMAGE_PADDING, y + IMAGE_PADDING);
  }

  const emojiMapPath: `${string}.${string}` = `${path.join(import.meta.dirname, "twemojiMaps", "twemojiMap")}${skinToneIndex}.png`;
  await canvas.write(emojiMapPath);

  console.log(
    `twemojiMap ${skinToneIndex + 1} of ${availableSkinTones.length} generated`,
  );
}
