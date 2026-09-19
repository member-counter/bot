import type { i18n } from "i18next";
import { PartyPopperIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataNitroboosters = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.NITRO_BOOSTERS,
    tKeyName: "nitroboosters",
    icon: PartyPopperIcon,
    i18n,
  });
