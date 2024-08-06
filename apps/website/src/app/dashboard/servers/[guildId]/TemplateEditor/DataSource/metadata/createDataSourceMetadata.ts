import type { DataSource } from "@mc/common/DataSource";
import type { i18n, TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { capitalize } from "lodash";

import type Resources from "~/@types/resources";

type PreTKey =
  keyof Resources["main"]["pages"]["dashboard"]["servers"]["dataSourceMetadata"];

type PrefixedTFunction<T extends PreTKey> = TFunction<
  "main",
  `pages.dashboard.servers.dataSourceMetadata.${T}`
>;

interface DataSourceMetadataOpts<
  T extends PreTKey = PreTKey,
  D extends DataSource = DataSource,
> {
  i18n: i18n;
  icon: LucideIcon;
  dataSource: D;
  preTKey: T;
  displayName?: (dataSource: D, t: PrefixedTFunction<T>) => string;
  hidden?: boolean;
}

export interface DataSourceMetadata<D extends DataSource = DataSource> {
  icon: LucideIcon;
  dataSource: D;
  description: string;
  keywords: string[];
  displayName: (dataSource: D) => string;
  hidden: boolean;
}

export function createDataSourceMetadata<
  T extends PreTKey,
  D extends DataSource,
>(opts: DataSourceMetadataOpts<T, D>): DataSourceMetadata<DataSource> {
  const t = opts.i18n.getFixedT(
    null,
    "main",
    `pages.dashboard.servers.dataSourceMetadata.${opts.preTKey}`,
  );

  const displayName: (dataSource: D, _t: PrefixedTFunction<T>) => string =
    opts.displayName ?? (() => t("name"));

  return {
    ...opts,
    description: t("description"),
    keywords: t("keywords", { returnObjects: true }),
    displayName: (dataSource: D) => capitalize(displayName(dataSource, t)),
    hidden: opts.hidden ?? false,
  };
}
