import type { DataSource, DataSourceId } from "@mc/common/DataSource";
import type { i18n, TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";

import type Resources from "~/@types/resources";
import { capitalize } from "~/other/capitalize";

type TKeyName = keyof Resources["main"]["dataSourceMetadata"];

type PrefixedTFunction<T extends TKeyName> = TFunction<
  "main",
  `dataSourceMetadata.${T}`
>;

interface DataSourceMetadataOpts<DI extends DataSourceId, T extends TKeyName> {
  i18n: i18n;
  icon: LucideIcon;
  dataSourceId: DI;
  tKeyName: T;
  displayName?: (
    dataSource: { id: DI } & DataSource,
    t: PrefixedTFunction<T>,
  ) => string;
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
  DI extends DataSourceId,
  T extends TKeyName,
>(opts: DataSourceMetadataOpts<DI, T>): DataSourceMetadata<DataSource> {
  const t: PrefixedTFunction<TKeyName> = opts.i18n.getFixedT(
    null,
    "main",
    `dataSourceMetadata.${opts.tKeyName}`,
  );

  return {
    icon: opts.icon,
    dataSource: { id: opts.dataSourceId },
    description: t("description"),
    keywords: t("keywords").split(","),
    displayName: (dataSource: DataSource) => {
      if (opts.displayName) {
        return capitalize(opts.displayName(dataSource as never, t));
      } else {
        return capitalize(t("name"));
      }
    },
    hidden: opts.hidden ?? false,
  };
}
