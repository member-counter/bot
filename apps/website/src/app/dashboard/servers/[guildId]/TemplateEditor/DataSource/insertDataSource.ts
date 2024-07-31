import type { DataSource, DataSourceId } from "@mc/common/DataSource";
import { useTranslation } from "react-i18next";
import { useSlateStatic } from "slate-react";
import { v4 } from "uuid";

import type { DataSourceElement } from "../custom-types";
import type { DataSourceRefId } from "../utils";
import { getDataSourceMetadata } from "./metadata";

export const useInsertDataSource = () => {
  const editor = useSlateStatic();
  const { t } = useTranslation();

  return (
    dataSourceId: DataSourceId,
    upsertFn: ([refId, dataSource]: [DataSourceRefId, DataSource]) => void,
  ) => {
    const refId = v4();
    const { dataSource } = getDataSourceMetadata(dataSourceId, t);

    upsertFn([refId, dataSource]);

    const node: DataSourceElement = {
      type: "dataSource",
      dataSourceRefId: refId,
      children: [{ text: "" }],
    };

    editor.insertNode(node);
    return refId;
  };
};
