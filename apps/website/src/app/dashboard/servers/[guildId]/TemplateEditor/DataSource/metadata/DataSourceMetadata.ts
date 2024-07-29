import type { DataSource } from "@mc/common/DataSource";
import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";

export abstract class DataSourceMetadata<D extends DataSource = DataSource> {
  constructor(protected t: TFunction) {}
  description = "";
  abstract icon: LucideIcon;
  abstract displayName(dataSource: D): string;
  abstract dataSource: D;
  keywords: string[] = [];
  hidden?: boolean = false;
}
