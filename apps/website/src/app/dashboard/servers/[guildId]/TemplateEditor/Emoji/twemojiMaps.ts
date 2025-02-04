import assert from "assert";
import { CSSProperties } from "react";

import { availableSkinTones } from "./emojis";
import twemojiMap0 from "./twemojiMaps/twemojiMap0.png";
import twemojiMap1 from "./twemojiMaps/twemojiMap1.png";
import twemojiMap2 from "./twemojiMaps/twemojiMap2.png";
import twemojiMap3 from "./twemojiMaps/twemojiMap3.png";
import twemojiMap4 from "./twemojiMaps/twemojiMap4.png";
import twemojiMap5 from "./twemojiMaps/twemojiMap5.png";

const twemojiMaps = [
  twemojiMap0,
  twemojiMap1,
  twemojiMap2,
  twemojiMap3,
  twemojiMap4,
  twemojiMap5,
];

export function getTwemojiMapBySkinTone(skinTone: string) {
  const index = availableSkinTones.indexOf(skinTone);

  const twemojiMap = twemojiMaps[index];

  assert(twemojiMap);

  return twemojiMap;
}
