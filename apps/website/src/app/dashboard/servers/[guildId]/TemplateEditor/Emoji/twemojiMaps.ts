import invariant from "tiny-invariant";

import { availableSkinTones } from "./emojis";
import twemojiMap0 from "./twemojiMaps/twemojiMap0.png?as=metadata&imagetools";
import twemojiMap1 from "./twemojiMaps/twemojiMap1.png?as=metadata&imagetools";
import twemojiMap2 from "./twemojiMaps/twemojiMap2.png?as=metadata&imagetools";
import twemojiMap3 from "./twemojiMaps/twemojiMap3.png?as=metadata&imagetools";
import twemojiMap4 from "./twemojiMaps/twemojiMap4.png?as=metadata&imagetools";
import twemojiMap5 from "./twemojiMaps/twemojiMap5.png?as=metadata&imagetools";

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

  invariant(twemojiMap);

  return twemojiMap;
}
