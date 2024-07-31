import type {
  DataSourceRoles,
  DataSourceTwitch,
  DataSourceYoutube,
} from "@mc/common/DataSource";
import type { i18n, TFunction } from "i18next";
import { TagsIcon, TwitchIcon, YoutubeIcon } from "lucide-react";

import { DataSourceId, TwitchDataSourceReturn } from "@mc/common/DataSource";

import { capitalize } from "~/other/capitalize";
import { createDataSourceMetadata } from "./createDataSourceMetadata";

const TwitchReturnTKey = {
  [TwitchDataSourceReturn.CHANNEL_NAME]: "channelName",
  [TwitchDataSourceReturn.FOLLOWERS]: "followers",
  [TwitchDataSourceReturn.VIEWERS]: "viewers",
} as const;

export const createDataSourceMetadataTwitch = (i18n: i18n) =>
  createDataSourceMetadata<"twitch", DataSourceTwitch>({
    i18n,
    preTKey: "twitch",
    dataSource: { id: DataSourceId.TWITCH },
    icon: TwitchIcon,
    displayName(dataSource, t) {
      if (!dataSource.options || typeof dataSource.options.return !== "number")
        return t("name");

      return capitalize(
        t("display.syntax", {
          returnKind: t(
            `display.returnKind.${TwitchReturnTKey[dataSource.options.return]}`,
          ),
        }),
      );
    },
  });
