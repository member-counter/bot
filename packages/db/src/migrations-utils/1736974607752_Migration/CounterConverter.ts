import { assert } from "console";
import { z } from "zod";

import type ConvertCounter from "./types/ConvertCounter";
import type { DataSource, DataSourceFormatSettings } from "./types/DataSource";
import type { OldFormattingSettings } from "./types/FormattingSettings";
import counters from "./counters/all";
import { safeCounterName } from "./safeCounterName";
import { DataSourceId, stringifyDataSoure } from "./types/DataSource";

class CountService {
  private static counters: ConvertCounter[] = counters.map((counter) => {
    counter.aliases = counter.aliases.map((alias) => safeCounterName(alias));
    return counter;
  });

  // TODO
  public static convertTemplate(content: string): string {
    // Check if there are counters pending to be processed
    while (/\{(.+?)\}/g.test(content)) {
      for (
        let i = 0, curlyOpenAt: number | null = null;
        i < content.length;
        i++
      ) {
        const char = content[i];
        if (char === "{") {
          curlyOpenAt = i;
        } else if (curlyOpenAt !== null && char === "}") {
          const curlyClosedAt = i;

          content =
            content.substring(0, curlyOpenAt) +
            stringifyDataSoure(
              this.convertCounter(
                content.substring(curlyOpenAt + 1, curlyClosedAt),
              ),
            ) +
            content.substring(curlyClosedAt + 1);

          break;
        }
      }
    }

    return content;
  }

  public static convertCounter(oldCounter: string): DataSource {
    const oldCounterSections = oldCounter
      .split(/(?<!\\):/)
      .map((section) => section.replace("\\:", ":"));

    const formattingSettings: DataSourceFormatSettings | undefined = (() => {
      if (!oldCounterSections[0]) return undefined;

      let foundObject: unknown;

      try {
        assert(oldCounterSections[0]);
        const firstSectionDecoded = Buffer.from(
          oldCounterSections[0],
          "base64",
        ).toString("utf-8");
        foundObject = JSON.parse(firstSectionDecoded);
        oldCounterSections.shift();
      } catch {
        return undefined;
      }

      try {
        const oldFormattingSettings: OldFormattingSettings = z
          .object({
            shortNumber: z.number().optional(),
            locale: z.string().optional(),
            digits: z.array(z.string()).optional(),
          })
          .parse(foundObject);

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
    })();

    const oldCounterName = oldCounterSections.shift();

    if (!oldCounterName) {
      return {
        id: DataSourceId.UNKNOWN,
      };
    }

    const aliasUsed = safeCounterName(oldCounterName);

    const counter = CountService.getCounterByAlias(aliasUsed);

    const unparsedArgs = oldCounterSections.join(":");
    const args = oldCounterSections.map((section) =>
      section.split(/(?<!\\),/).map((arg) => arg.replace(/\\(.)/g, "$1")),
    );

    if (counter) {
      return counter.convert({
        aliasUsed,
        format: formattingSettings,
        unparsedArgs,
        args,
      });
    } else {
      return {
        id: DataSourceId.UNKNOWN,
      };
    }
  }

  public static getCounterByAlias(alias: string): ConvertCounter | null {
    for (const counter of this.counters) {
      if (counter.aliases.includes(safeCounterName(alias))) return counter;
    }
    return null;
  }
}

export default CountService;
