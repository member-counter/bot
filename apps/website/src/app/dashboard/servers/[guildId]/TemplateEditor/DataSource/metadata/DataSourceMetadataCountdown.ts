import type { i18n } from "i18next";
import { HourglassIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataCountdown = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.COUNTDOWN,
    tKeyName: "countdown",
    icon: HourglassIcon,
    i18n,
    displayName(dataSource, t) {
      if (!dataSource.options || typeof dataSource.options.date !== "number")
        return t("name");

      return t("display.syntax", {
        datetime: new Date(dataSource.options.date).toLocaleString(),
      });
    },
  });
