import type { DataSource, DataSourceId } from "@mc/common/DataSource";
import type { Editor } from "slate";
import { v4 } from "uuid";

import type { DataSourceElement } from "../custom-types";
import type { DataSourceRefId } from "../utils";
import { getDataSourceMetadata } from "./dataSourcesMetadata";

export const insertDataSource = (
  editor: Editor,
  dataSourceId: DataSourceId,
  upsertFn: ([refId, dataSource]: [DataSourceRefId, DataSource]) => void,
) => {
  const refId = v4();
  const { dataSource } = getDataSourceMetadata(dataSourceId);

  upsertFn([refId, dataSource]);

  const node: DataSourceElement = {
    type: "dataSource",
    dataSourceRefId: refId,
    children: [{ text: "" }],
  };

  editor.insertNode(node);
  return refId;
};
