import twemoji from "@twemoji/api";

export const IMAGES_PER_ROW = 30;
export const IMAGE_RESOLUTION = 30;
export const IMAGE_PADDING = 1;

export function indexToCoords(
  index: number,
  imageRes: number,
  canvasWidth: number,
): [number, number] {
  const cols = canvasWidth / imageRes;
  const row = Math.floor(index / cols);
  const col = index % cols;
  return [col * imageRes, row * imageRes];
}

/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */ /*
     https://github.com/jdecked/twemoji/blob/gh-pages/LICENSE
 */

// avoid runtime RegExp creation for not so smart,
// not JIT based, and old browsers / engines
const UFE0Fg = /\uFE0F/g;

// avoid using a string literal like '\u200D' here because minifiers expand it inline
const U200D = String.fromCharCode(0x200d);

/**
 * Used to both remove the possible variant
 *  and to convert utf16 into code points.
 *  If there is a zero-width-joiner (U+200D), leave the variants in.
 * @param   string    the raw text of the emoji match
 * @return  string    the code point
 */
export function grabTheRightIcon(rawText: string) {
  // exception for 👁️‍🗨️, see: https://github.com/twitter/twemoji/issues/405
  if (rawText === "👁️‍🗨️") return "1f441-200d-1f5e8";

  // if variant is present as \uFE0F
  return twemoji.convert.toCodePoint(
    !rawText.includes(U200D) ? rawText.replace(UFE0Fg, "") : rawText,
  );
}
