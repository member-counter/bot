import type { DataSource } from "@mc/common/DataSource";
import type { Grammar } from "prismjs";
import type { BaseEditor, Descendant } from "slate";
import type { ReactEditor } from "slate-react";
import { useReducer } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

import withDataSource from "./DataSource/withDataSource";
import withEmoji from "./Emoji/withEmoji";
import withMention from "./Mention/withMention";

export const setNodesValue = (
  editor: BaseEditor & ReactEditor,
  nodes: Descendant[],
) => {
  Transforms.delete(editor, {
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
  });

  Transforms.removeNodes(editor, {
    at: [0],
  });

  Transforms.insertNodes(editor, nodes);
};

export const buildEditor = (features: Grammar) => {
  let editor = withReact(withHistory(createEditor()));

  if ("dataSource" in features) {
    editor = withDataSource(editor);
  }

  if ("emoji" in features) {
    editor = withEmoji(editor);
  }

  if ("role" in features || "channel" in features) {
    editor = withMention(editor);
  }

  return editor;
};

export type DataSourceRefId = string;
export type DataSourceRefs = Map<DataSourceRefId, DataSource>;

const dataSourceReducer = (
  dataSources: DataSourceRefs,
  [refId, dataSource]: [DataSourceRefId, DataSource],
) => {
  return new Map(dataSources.set(refId, structuredClone(dataSource)));
};

export const useDataSourceReducer = (
  initialDataSourceRefs: DataSourceRefs = new Map(),
) => useReducer(dataSourceReducer, initialDataSourceRefs);

export const defaultInitialEditorValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
