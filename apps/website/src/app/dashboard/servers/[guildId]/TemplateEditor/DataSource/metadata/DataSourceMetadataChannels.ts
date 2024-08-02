import type { i18n } from "i18next";
import { HashIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataChannels = (i18n: i18n) =>
  createDataSourceMetadata({
    i18n,
    tKeyName: "channels",
    dataSourceId: DataSourceId.CHANNELS,
    icon: HashIcon,
    displayName(dataSource, t) {
      if (!dataSource.options?.categories?.length) return t("name");
      return t("display.channelsUnderACategory");
    },
  });
