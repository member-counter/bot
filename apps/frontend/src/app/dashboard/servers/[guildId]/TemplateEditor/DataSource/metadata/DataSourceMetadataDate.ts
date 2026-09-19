import type { i18n } from "i18next";
import { CalendarIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataDate = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.DATE,
    tKeyName: "date",
    icon: CalendarIcon,
    i18n,
    displayName(dataSource, t) {
      if (
        !dataSource.options ||
        typeof dataSource.options.timezone !== "string"
      )
        return t("name");

      return t("display.syntax", {
        interpolation: { escapeValue: false },
        timezone: dataSource.options.timezone,
      });
    },
  });
