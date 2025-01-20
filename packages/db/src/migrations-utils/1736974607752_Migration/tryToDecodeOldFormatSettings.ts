import { z } from "zod";

import type { OldFormattingSettings } from "./types/OldCounter";

export function tryToDecodeOldFormatSettings(
  data: string,
): OldFormattingSettings | null {
  try {
    const firstSectionDecoded = Buffer.from(data, "base64").toString("utf-8");

    const oldFormattingSettings: OldFormattingSettings = z
      .object({
        shortNumber: z.number().optional().nullable(),
        locale: z.string().optional().nullable(),
        digits: z.array(z.string()).optional().nullable(),
      })
      .parse(JSON.parse(firstSectionDecoded));

    return oldFormattingSettings;
  } catch {
    return null;
  }
}
