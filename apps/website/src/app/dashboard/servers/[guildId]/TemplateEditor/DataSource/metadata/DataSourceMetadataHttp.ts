import type { i18n } from "i18next";
import { LinkIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataHTTP = (i18n: i18n) =>
  createDataSourceMetadata({
    i18n,
    tKeyName: "http",
    dataSourceId: DataSourceId.HTTP,
    icon: LinkIcon,
    displayName(dataSource, t) {
      let displayName: string = t("name");

      try {
        if (typeof dataSource.options?.url === "string")
          displayName = t("display.syntax", {
            hostname: new URL(dataSource.options.url).hostname,
          });
      } catch {
        /* empty */
      }

      return displayName;
    },
  });
