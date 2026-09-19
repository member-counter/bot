import type { Grammar } from "prismjs";

import { applyRecursivePatterns } from "../../applyRecursivePatterns";
import { dataSourceGrammar } from "../dataSource";

export const discordChannelNameWithDataSource: Grammar = applyRecursivePatterns(
  {
    ...dataSourceGrammar,
  },
);
