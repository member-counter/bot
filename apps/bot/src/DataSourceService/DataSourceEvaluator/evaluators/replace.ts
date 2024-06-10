import { DataSourceId } from "@mc/common/DataSource";

import { DataSourceEvaluator } from "..";

export const replaceEvaluator = new DataSourceEvaluator({
  id: DataSourceId.REPLACE,
  execute: ({ options }) => {
    const text = (options.text ?? "") as string;
    const replacements = options.replacements ?? [];

    let newText = text;

    for (const replace of replacements) {
      const { search, replacement } = replace;
      if (!search || !replacement) continue;
      newText = newText.replaceAll(search as string, replacement as string);
    }

    return newText;
  },
});
