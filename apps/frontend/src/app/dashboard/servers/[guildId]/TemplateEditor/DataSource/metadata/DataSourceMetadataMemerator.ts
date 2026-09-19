import type { i18n } from "i18next";
import { FerrisWheelIcon } from "lucide-react";

import { DataSourceId, MemeratorDataSourceReturn } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

const MemeratorReturnTKey = {
  [MemeratorDataSourceReturn.FOLLOWERS]: "followers",
  [MemeratorDataSourceReturn.MEMES]: "memes",
} as const;

export const createDataSourceMetadataMemerator = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.MEMERATOR,
    tKeyName: "memerator",
    icon: FerrisWheelIcon,
    i18n,
    displayName(dataSource, t) {
      if (!dataSource.options || typeof dataSource.options.return !== "number")
        return t("name");

      return t("display.syntax", {
        returnKind: t(
          `display.returnKind.${MemeratorReturnTKey[dataSource.options.return]}`,
        ),
        interpolation: { escapeValue: false },
      });
    },
  });
