import type { i18n } from "i18next";
import { TwitchIcon } from "lucide-react";

import { DataSourceId, TwitchDataSourceReturn } from "@mc/common/DataSource";

import { capitalize } from "~/other/capitalize";
import { createDataSourceMetadata } from "./createDataSourceMetadata";

const TwitchReturnTKey = {
  [TwitchDataSourceReturn.CHANNEL_NAME]: "channelName",
  [TwitchDataSourceReturn.FOLLOWERS]: "followers",
  [TwitchDataSourceReturn.VIEWERS]: "viewers",
} as const;

export const createDataSourceMetadataTwitch = (i18n: i18n) =>
  createDataSourceMetadata({
    i18n,
    tKeyName: "twitch",
    dataSourceId: DataSourceId.TWITCH,
    icon: TwitchIcon,
    displayName(dataSource, t) {
      if (!dataSource.options || typeof dataSource.options.return !== "number")
        return t("name");

      return capitalize(
        t("display.syntax", {
          returnKind: t(
            `display.returnKind.${TwitchReturnTKey[dataSource.options.return]}`,
          ),
          interpolation: { escapeValue: false },
        }),
      );
    },
  });
