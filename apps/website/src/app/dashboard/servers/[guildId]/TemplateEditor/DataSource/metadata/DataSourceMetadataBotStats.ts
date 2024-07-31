import type { DataSourceBotStats } from "@mc/common/DataSource";
import type { i18n } from "i18next";
import { BotIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataBotStats = (i18n: i18n) =>
  createDataSourceMetadata<"botStats", DataSourceBotStats>({
    i18n,
    preTKey: "botStats",
    dataSource: { id: DataSourceId.BOT_STATS },
    icon: BotIcon,
  });
