import type { i18n } from "i18next";
import { Tally5Icon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { getDataSourceMetadata } from ".";
import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataNumber = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.NUMBER,
    tKeyName: "number",
    icon: Tally5Icon,
    i18n,
    displayName(dataSource, t) {
      if (!dataSource.options) {
        return t("name");
      } else if (
        typeof dataSource.options.number === "object" &&
        "id" in dataSource.options.number
      ) {
        const nestedMetadata = getDataSourceMetadata(
          dataSource.options.number.id,
          i18n,
        );

        return t("display.dataSource", {
          dataSourceDisplayName: nestedMetadata.displayName(
            dataSource.options.number,
          ),
          interpolation: { escapeValue: false },
        });
      } else {
        return t("display.raw", {
          number: dataSource.options.number,
          interpolation: { escapeValue: false },
        });
      }
    },
  });
