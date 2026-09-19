import type { Grammar } from "prismjs";

import { applyRecursivePatterns } from "../../applyRecursivePatterns";
import { boldGrammar } from "../bold";
import { channelGrammar } from "../channel";
import { emojiGrammar } from "../emoji";
import { italicGrammar } from "../italic";
import { roleGrammar } from "../role";
import { spoilerGrammar } from "../spoiler";
import { strikeGrammar } from "../strike";
import { underlineGrammar } from "../underline";

export const discordChannelTopic: Grammar = applyRecursivePatterns({
  ...boldGrammar,
  ...italicGrammar,
  ...strikeGrammar,
  ...underlineGrammar,
  ...spoilerGrammar,
  ...emojiGrammar,
  ...channelGrammar,
  ...roleGrammar,
});
