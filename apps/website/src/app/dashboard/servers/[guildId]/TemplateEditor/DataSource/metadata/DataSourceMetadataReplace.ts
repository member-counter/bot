import type { i18n } from "i18next";
import { ReplaceIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataReplace = (i18n: i18n) =>
  createDataSourceMetadata({
    i18n,
    tKeyName: "replace",
    dataSourceId: DataSourceId.REPLACE,
    icon: ReplaceIcon,
    displayName(dataSource, t) {
      if (!dataSource.options?.replacements?.length) return t("name");

      const formatter = new Intl.ListFormat(i18n.resolvedLanguage, {
        style: "long",
        type: "conjunction",
      });

      const replacements = formatter.format(
        dataSource.options.replacements
          .map(({ replacement, search }) => {
            if (!replacement || !search) return;
            if (typeof replacement !== "string" || typeof search !== "string")
              return;
            return t("display.replaceSyntax", { replacement, search });
          })
          .filter(Boolean),
      );

      return t("display.syntax", { replaceSyntax: replacements });
    },
  });
