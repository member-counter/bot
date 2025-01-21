import type { DataSourceFormatSettings } from "./types/DataSource";
import type { OldFormattingSettings } from "./types/OldCounter";

export function convertFormatSettings(
  oldFormattingSettings: OldFormattingSettings | null,
): DataSourceFormatSettings | undefined {
  if (!oldFormattingSettings) {
    return undefined;
  }

  try {
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
