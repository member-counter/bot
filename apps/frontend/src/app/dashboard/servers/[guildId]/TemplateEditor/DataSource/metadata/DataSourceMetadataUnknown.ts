import type { i18n } from "i18next";
import { HelpCircleIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataUnknown = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.UNKNOWN,
    tKeyName: "unknown",
    hidden: true,
    icon: HelpCircleIcon,
    i18n,
  });
