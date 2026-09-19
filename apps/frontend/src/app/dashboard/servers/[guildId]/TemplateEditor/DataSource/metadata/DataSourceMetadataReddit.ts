import type { i18n } from "i18next";
import { CakeSliceIcon } from "lucide-react";

import { DataSourceId, RedditDataSourceReturn } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

const RedditReturnTKey = {
  [RedditDataSourceReturn.MEMBERS]: "members",
  [RedditDataSourceReturn.MEMBERS_ONLINE]: "membersOnline",
  [RedditDataSourceReturn.TITLE]: "title",
} as const;

export const createDataSourceMetadataReddit = (i18n: i18n) =>
  createDataSourceMetadata({
    i18n,
    tKeyName: "reddit",
    dataSourceId: DataSourceId.REDDIT,
    icon: CakeSliceIcon,
    displayName(dataSource, t) {
      if (!dataSource.options || typeof dataSource.options.return !== "number")
        return t("name");

      return t("display.syntax", {
        returnKind: t(
          `display.returnKind.${RedditReturnTKey[dataSource.options.return]}`,
        ),
        interpolation: { escapeValue: false },
      });
    },
  });
