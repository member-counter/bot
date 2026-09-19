import type { DataSource } from "@mc/common/DataSource";
import { createContext, useContext } from "react";

import type { DataSourceRefId, DataSourceRefs } from "../utils";

export const DataSourceRefsContext = createContext<{
  dataSourceRefs: DataSourceRefs;
  setDataSourceRef: ([refId, dataSource]: [
    DataSourceRefId,
    DataSource,
  ]) => void;
  editingDataSourceRefId: DataSourceRefId | null;
  setEditingDataSourceRefId: (refId: DataSourceRefId | null) => void;
} | null>(null);

export function useDataSourceRefs() {
  const dataSourceRefsContext = useContext(DataSourceRefsContext);

  if (!dataSourceRefsContext)
    throw new Error(
      `DataSourceRefsContext is not available, did you forget to setup DataSourceRefsContext.Provider?`,
    );

  return dataSourceRefsContext;
}
