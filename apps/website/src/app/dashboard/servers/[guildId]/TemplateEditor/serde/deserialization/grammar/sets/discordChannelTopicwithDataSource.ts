import type { Grammar } from "prismjs";

import { applyRecursivePatterns } from "../../applyRecursivePatterns";
import { dataSourceGrammar } from "../dataSource";
import { discordChannelTopic } from "./discordChannelTopic";

export const discordChannelTopicWithDataSource: Grammar =
  applyRecursivePatterns({
    ...discordChannelTopic,
    ...dataSourceGrammar,
  });
