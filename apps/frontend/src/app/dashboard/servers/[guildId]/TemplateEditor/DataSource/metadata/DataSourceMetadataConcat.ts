import type { i18n } from "i18next";
import { MergeIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataConcat = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.CONCAT,
    tKeyName: "concat",
    icon: MergeIcon,
    i18n,
    displayName(dataSource, t) {
      if (!dataSource.options || !Array.isArray(dataSource.options.strings))
        return t("name");

      const formatter = new Intl.ListFormat(i18n.language, {
        style: "long",
        type: "conjunction",
      });

      const displayableStrings = dataSource.options.strings
        .filter((str) => typeof str !== "object")
        .map((str) => String(str));

      const nonDisplayableStrings =
        dataSource.options.strings.length - displayableStrings.length;

      const displayableStringsJoined = formatter.format(displayableStrings);

      return t("display.syntax", {
        interpolation: { escapeValue: false },
        strings: displayableStringsJoined,
        undisplayableStrings: nonDisplayableStrings
          ? t("display.undisplayableStrings", {
              amount: nonDisplayableStrings,
            })
          : "",
      })
        .split(/\s+/)
        .join(" ");
    },
  });
