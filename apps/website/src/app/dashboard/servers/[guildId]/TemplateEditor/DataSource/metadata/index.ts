import type { DataSource } from "@mc/common/DataSource";
import type { i18n } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DataSourceId } from "@mc/common/DataSource";

import type { DataSourceMetadata } from "./createDataSourceMetadata";
import type { Searchable } from "~/app/components/Combobox";
import { createDataSourceMetadataBotStats } from "./DataSourceMetadataBotStats";
import { createDataSourceMetadataChannels } from "./DataSourceMetadataChannels";
import { createDataSourceMetadataClock } from "./DataSourceMetadataClock";
import { createDataSourceMetadataCountdown } from "./DataSourceMetadataCountdown";
import { createDataSourceMetadataGame } from "./DataSourceMetadataGame";
import { createDataSourceMetadataHTTP } from "./DataSourceMetadataHttp";
import { createDataSourceMetadataMath } from "./DataSourceMetadataMath";
import { createDataSourceMetadataMembers } from "./DataSourceMetadataMembers";
import { createDataSourceMetadataMemerator } from "./DataSourceMetadataMemerator";
import { createDataSourceMetadataNitroboosters } from "./DataSourceMetadataNitroboosters";
import { createDataSourceMetadataNumber } from "./DataSourceMetadataNumber";
import { createDataSourceMetadataReddit } from "./DataSourceMetadataReddit";
import { createDataSourceMetadataReplace } from "./DataSourceMetadataReplace";
import { createDataSourceMetadataRoles } from "./DataSourceMetadataRoles";
import { createDataSourceMetadataTwitch } from "./DataSourceMetadataTwitch";
import { createDataSourceMetadataUnknown } from "./DataSourceMetadataUnknown";
import { createDataSourceMetadataYoutube } from "./DataSourceMetadataYoutube";

export function dataSourcesMetadataFactory(
  i18n: i18n,
): Record<string, DataSourceMetadata> {
  return Object.fromEntries(
    [
      createDataSourceMetadataBotStats(i18n),
      createDataSourceMetadataChannels(i18n),
      createDataSourceMetadataCountdown(i18n),
      createDataSourceMetadataClock(i18n),
      createDataSourceMetadataNitroboosters(i18n),
      createDataSourceMetadataNumber(i18n),
      createDataSourceMetadataReddit(i18n),
      createDataSourceMetadataReplace(i18n),
      createDataSourceMetadataGame(i18n),
      createDataSourceMetadataHTTP(i18n),
      createDataSourceMetadataMath(i18n),
      createDataSourceMetadataMembers(i18n),
      createDataSourceMetadataMemerator(i18n),
      createDataSourceMetadataRoles(i18n),
      createDataSourceMetadataTwitch(i18n),
      createDataSourceMetadataUnknown(i18n),
      createDataSourceMetadataYoutube(i18n),
    ]
      .map((metadata) => {
        metadata.dataSource = Object.freeze(metadata.dataSource);
        return metadata;
      })
      .map((metatdata) => [metatdata.dataSource.id, metatdata]),
  );
}

export function getDataSourceMetadata(
  id: DataSourceId,
  i18n: i18n,
): DataSourceMetadata {
  const metadata = dataSourcesMetadataFactory(i18n)[id];
  if (!metadata) return getDataSourceMetadata(DataSourceId.UNKNOWN, i18n);
  return metadata;
}

export function useDataSourceMetadata(id: DataSourceId): DataSourceMetadata {
  const { i18n } = useTranslation();
  const metadata = useMemo(() => getDataSourceMetadata(id, i18n), [id, i18n]);
  return metadata;
}

export function useSearcheableDataSourceMetadata(): Searchable<DataSourceMetadata>[] {
  const { i18n } = useTranslation();

  const searcheableDataSources = useMemo(
    () =>
      Object.values(dataSourcesMetadataFactory(i18n)).map((i) => ({
        value: i,
        keywords: i.keywords,
      })),
    [i18n],
  );

  return searcheableDataSources;
}

export const useSearcheableDataSource = (): Searchable<DataSource>[] => {
  const searcheableDataSources = useSearcheableDataSourceMetadata();
  return searcheableDataSources.map((s) => ({
    ...s,
    value: s.value.dataSource,
  }));
};

export const useKnownSearcheableDataSourceMetadata =
  (): Searchable<DataSourceMetadata>[] => {
    const searcheableDataSources = useSearcheableDataSourceMetadata();
    return searcheableDataSources.filter(
      (d) => d.value.dataSource.id !== DataSourceId.UNKNOWN,
    );
  };

export const useKnownSearcheableDataSource = (): Searchable<DataSource>[] => {
  const searcheableDataSources = useKnownSearcheableDataSourceMetadata();
  return searcheableDataSources.map((s) => ({
    ...s,
    value: s.value.dataSource,
  }));
};
