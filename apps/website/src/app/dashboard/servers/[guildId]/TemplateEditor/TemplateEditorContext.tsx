import type { DataSource } from "@mc/common/DataSource";
import type { Grammar } from "prismjs";
import { createContext } from "react";

import type { DataSourceRefId, DataSourceRefs } from "./utils";

export const TemplateEditorContext = createContext<{
  features: Grammar;
  dataSourceRefs: DataSourceRefs;
  setDataSourceRef: ([refId, dataSource]: [
    DataSourceRefId,
    DataSource,
  ]) => void;
  editingDataSourceRefId: DataSourceRefId | null;
  setEditingDataSourceRefId: (refId: DataSourceRefId | null) => void;
  editingDataSourceRef: DataSource | null;
}>({
  features: {},
  dataSourceRefs: new Map(),
  setDataSourceRef: () => void 0,
  editingDataSourceRefId: null,
  setEditingDataSourceRefId: () => void 0,
  editingDataSourceRef: null,
});
