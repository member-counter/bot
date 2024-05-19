import type { DataSource } from "@mc/common/DataSource";

export interface SetupOptionsInterface<O extends DataSource> {
  options: O["options"];
  onOptionsChange: (newOptions: O["options"]) => void;
}
