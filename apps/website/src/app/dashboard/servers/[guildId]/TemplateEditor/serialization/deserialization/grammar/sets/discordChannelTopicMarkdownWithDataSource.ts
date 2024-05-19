import type { Grammar } from "prismjs";

import { applyRecursivePatterns } from "../../applyRecursivePatterns";
import { dataSourceGrammar } from "../dataSource";
import { discordChannelTopicMarkdown } from "./discordChannelTopicMarkdown";

export const discordChannelTopicMarkdownWithDataSource: Grammar =
  applyRecursivePatterns({
    ...discordChannelTopicMarkdown,
    ...dataSourceGrammar,
  });
