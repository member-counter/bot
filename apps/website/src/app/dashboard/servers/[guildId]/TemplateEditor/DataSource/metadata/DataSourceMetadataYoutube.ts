import type { i18n } from "i18next";
import { YoutubeIcon } from "lucide-react";

import { DataSourceId, YouTubeDataSourceReturn } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

const YoutubeReturnTKey = {
  [YouTubeDataSourceReturn.CHANNEL_NAME]: "channelName",
  [YouTubeDataSourceReturn.SUBSCRIBERS]: "subscribers",
  [YouTubeDataSourceReturn.VIDEOS]: "videos",
  [YouTubeDataSourceReturn.VIEWS]: "views",
} as const;

export const createDataSourceMetadataYoutube = (i18n: i18n) =>
  createDataSourceMetadata({
    i18n,
    tKeyName: "youtube",
    dataSourceId: DataSourceId.YOUTUBE,
    icon: YoutubeIcon,
    displayName(dataSource, t) {
      if (!dataSource.options || typeof dataSource.options.return !== "number")
        return t("name");

      return t("display.syntax", {
        returnKind: t(
          `display.returnKind.${YoutubeReturnTKey[dataSource.options.return]}`,
        ),
        interpolation: { escapeValue: false },
      });
    },
  });
