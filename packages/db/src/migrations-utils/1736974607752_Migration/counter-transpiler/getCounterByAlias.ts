import type ConvertCounter from "./types/ConvertCounter";
import counters from "./counters/all";
import { safeCounterName } from "./safeCounterName";

export function getCounterByAlias(alias: string): ConvertCounter | null {
  for (const counter of counters) {
    if (counter.aliases.includes(safeCounterName(alias))) return counter;
  }
  return null;
}
