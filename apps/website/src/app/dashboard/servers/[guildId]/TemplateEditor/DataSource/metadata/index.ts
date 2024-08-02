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
import { createDataSourceMetadataMath } from "./DataSourceMetadataMath";
import { createDataSourceMetadataMembers } from "./DataSourceMetadataMembers";
import { createDataSourceMetadataMemerator } from "./DataSourceMetadataMemerator";
import { createDataSourceMetadataNitroboosters } from "./DataSourceMetadataNitroboosters";
import { createDataSourceMetadataRoles } from "./DataSourceMetadataRoles";
import { createDataSourceMetadataTwitch } from "./DataSourceMetadataTwitch";
import { createDataSourceMetadataUnknown } from "./DataSourceMetadataUnknown";
import { createDataSourceMetadataYoutube } from "./DataSourceMetadataYoutube";
import { createDataSourceMetadataNumber } from "./DataSourceMetadataNumber";

// const redditDataSourceMetadata: DataSourceMetadata<DataSourceReddit> = {
//   icon: CakeSliceIcon,
//   description:
//     "Retrieve the title of a subreddit along with the total number of members and the count of members currently online.",
//   displayName: (dataSource: DataSourceReddit) => {
//     if (!dataSource.options || typeof dataSource.options.return !== "number")
//       return "Reddit";

//     const displayName = ["subreddit"];

//     const display = {
//       [RedditDataSourceReturn.MEMBERS]: "members",
//       [RedditDataSourceReturn.MEMBERS_ONLINE]: "members online",
//       [RedditDataSourceReturn.TITLE]: "title",
//     };

//     displayName.push(display[dataSource.options.return]);

//     const displayNameString = displayName.join(" ");

//     return (
//       displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
//     );
//   },
//   dataSource: { id: DataSourceId.REDDIT },
//   keywords: ["Reddit", "subreddit", "members", "online"],
// };
// const httpDataSourceMetadata: DataSourceMetadata<DataSourceHTTP> = {
//   icon: LinkIcon,
//   description:
//     "Send a GET request to an endpoint and provide the result to this bot.",
//   displayName: (dataSource: DataSourceHTTP) => {
//     const displayName = ["HTTP"];

//     try {
//       if (typeof dataSource.options?.url === "string")
//         displayName.push(new URL(dataSource.options.url).hostname);
//     } catch {
//       /* empty */
//     }

//     const displayNameString = displayName.join(" ");

//     return (
//       displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
//     );
//   },
//   dataSource: { id: DataSourceId.HTTP },
//   keywords: ["HTTP", "GET", "request", "endpoint", "API", "fetch"],
// };
// const replaceDataSourceMetadata: DataSourceMetadata<DataSourceReplace> = {
//   icon: ReplaceIcon,
//   description:
//     "Text replacement, useful in conjunction with other nested counters for comprehensive text modification.",
//   displayName: (dataSource: DataSourceReplace) => {
//     if (!dataSource.options?.replacements?.length) return "Replace text";

//     const displayName = ["replace"];

//     displayName.push(
//       dataSource.options.replacements
//         .map(({ replacement, search }) => {
//           if (!replacement || !search) return;
//           if (typeof replacement !== "string" || typeof search !== "string")
//             return;
//           return `"${search}" by "${replacement}"`;
//         })
//         .filter(Boolean)
//         .join(", "),
//     );

//     if (displayName.length === 1) displayName.push("text");

//     const displayNameString = displayName.join(" ");

//     return (
//       displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
//     );
//   },
//   dataSource: { id: DataSourceId.REPLACE },
//   keywords: ["text", "replacement", "modification", "string", "substring"],
// };
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
      createDataSourceMetadataGame(i18n),
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
