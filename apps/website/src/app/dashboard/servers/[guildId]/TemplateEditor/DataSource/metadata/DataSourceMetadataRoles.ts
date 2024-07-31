import type { DataSourceRoles } from "@mc/common/DataSource";
import type { i18n } from "i18next";
import { TagsIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

export const createDataSourceMetadataRoles = (i18n: i18n) =>
  createDataSourceMetadata<"roles", DataSourceRoles>({
    i18n,
    preTKey: "roles",
    dataSource: { id: DataSourceId.ROLES },
    icon: TagsIcon,
  });
