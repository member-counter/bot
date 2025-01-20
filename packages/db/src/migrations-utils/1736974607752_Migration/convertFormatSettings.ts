import { z } from "zod";

import type { DataSourceFormatSettings } from "./types/DataSource";
import type { OldFormattingSettings } from "./types/OldCounter";

export function convertFormatSettings(
  data: OldFormattingSettings | null,
): DataSourceFormatSettings | undefined {
  if (!data) {
    return undefined;
  }

  try {
    const oldFormattingSettings: OldFormattingSettings = z
      .object({
        shortNumber: z.number().optional(),
        locale: z.string().optional(),
        digits: z.array(z.string()).optional(),
      })
      .parse(data);

    return {
      compactNotation:
        oldFormattingSettings.shortNumber != null
          ? oldFormattingSettings.shortNumber === 1
          : null,
      locale: oldFormattingSettings.locale,
      digits: oldFormattingSettings.digits,
    } satisfies DataSourceFormatSettings;
  } catch {
    return undefined;
  }
}
