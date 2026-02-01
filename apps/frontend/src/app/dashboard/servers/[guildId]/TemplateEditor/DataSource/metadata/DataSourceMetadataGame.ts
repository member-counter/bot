import type { i18n } from "i18next";
import { Gamepad2Icon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataGame = (i18n: i18n) =>
  createDataSourceMetadata({
    i18n,
    tKeyName: "game",
    dataSourceId: DataSourceId.GAME,
    icon: Gamepad2Icon,
    displayName(dataSource, t) {
      if (
        !dataSource.options?.address ||
        typeof dataSource.options.address === "object"
      )
        return t("name");

      return t("display.playerCountFor", {
        gameServerAddress: dataSource.options.address,
        interpolation: { escapeValue: false },
      });
    },
  });
