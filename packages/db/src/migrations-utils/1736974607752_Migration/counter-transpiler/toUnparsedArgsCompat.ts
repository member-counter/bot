import type ConvertCounter from "./types/ConvertCounter";
import type { DataSource } from "./types/DataSource";
import { toConcat } from "./wrappers";

export function toUnparsedArgsCompat(
  args: Parameters<ConvertCounter["convert"]>[0]["args"],
): string | DataSource {
  const concatDataSource = toConcat(
    args.map((arg) => toConcat(arg, ",")),
    ":",
  );

  return concatDataSource;
}
