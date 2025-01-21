import assert from "assert";
import z from "zod";

import type ConvertCounter from "../types/ConvertCounter";
import type { DataSource, DataSourceHTTP } from "../types/DataSource";
import { DataSourceId } from "../types/DataSource";

function parseArgs(args: (DataSource | string)[][]) {
  try {
    assert(args[0]?.[0]);

    const encodedOptions = args[0][0];

    if (typeof encodedOptions !== "string") {
      throw new SyntaxError(
        "Unsupported edge case for http options, please contact support",
      );
    }

    const decodedOptions = Buffer.from(encodedOptions, "base64").toString(
      "utf-8",
    );

    return z
      .object({
        url: z.string().optional(),
        parseNumber: z.coerce.boolean().optional(),
        dataPath: z.string().optional(),
        lifetime: z.coerce.number().optional(),
      })
      .parse(JSON.parse(decodedOptions));
  } catch {
    return {};
  }
}

const HTTPCounter: ConvertCounter = {
  aliases: ["http", "https", "http-string", "https-string"],
  convert: ({ args, format }) => {
    const { url, parseNumber, dataPath, lifetime } = parseArgs(args);

    const httpDataSource = {
      id: DataSourceId.HTTP,
      format,
      options: {
        url,
        dataPath,
        lifetime,
      },
    } as DataSourceHTTP;

    if (parseNumber) {
      return {
        id: DataSourceId.NUMBER,
        format,
        options: {
          number: httpDataSource,
        },
      };
    } else {
      return httpDataSource;
    }
  },
};

export default HTTPCounter;
