"use client";

import type { Grammar } from "prismjs";
import type { ReactNode } from "react";
import type { Descendant } from "slate";
import React, { useEffect, useMemo, useState } from "react";
import { Slate } from "slate-react";
import { v4 } from "uuid";

import type { DataSourceRefId, DataSourceRefs } from "./utils";
import { TemplateEditorContext } from "./TemplateEditorContext";
import {
  buildEditor,
  defaultInitialEditorValue,
  setNodesValue,
  useDataSourceReducer,
} from "./utils";

export default function TemplateEditor({
  initialValue = {
    nodes: defaultInitialEditorValue,
    dataSourceRefs: new Map(),
  },
  onChange,
  readAgainInitialValue,
  features,
  children,
}: {
  initialValue?: { nodes: Descendant[]; dataSourceRefs: DataSourceRefs };
  onChange?: (nodes: Descendant[], dataSourceRefs: DataSourceRefs) => void;
  readAgainInitialValue?: number;
  features: Grammar;
  children: ReactNode;
}): JSX.Element {
  const [editor] = useState(buildEditor(features));

  // Data source handling
  const [dataSourceRefs, setDataSourceRef] = useDataSourceReducer(
    initialValue.dataSourceRefs,
  );

  useEffect(() => {
    setNodesValue(editor, initialValue.nodes);
    dataSourceRefs.clear();
    initialValue.dataSourceRefs.forEach((dataSourceRef, dataSourceRefId) =>
      setDataSourceRef([dataSourceRefId, dataSourceRef]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readAgainInitialValue]);

  const [editingDataSourceRefId, setEditingDataSourceRefId] =
    useState<DataSourceRefId | null>(null);

  const editingDataSourceRef = useMemo(
    () => dataSourceRefs.get(editingDataSourceRefId ?? "") ?? null,
    [dataSourceRefs, editingDataSourceRefId],
  );

  // Handle data source paste
  const [defaultInsertFragment] = useState(() => editor.insertFragment);
  editor.insertFragment = (fragments) => {
    fragments.forEach((fragment) => {
      if (!("children" in fragment)) return;
      fragment.children.forEach((node) => {
        if (!("type" in node)) return;
        if (node.type !== "dataSource") return;

        const dataSourceRefId = node.dataSourceRefId;
        const dataSource = dataSourceRefs.get(dataSourceRefId);

        if (!dataSource) return;

        node.dataSourceRefId = v4();
        setDataSourceRef([node.dataSourceRefId, dataSource]);
      });
    });

    defaultInsertFragment(fragments);
  };

  const contextValue = useMemo(
    () => ({
      features,
      dataSourceRefs,
      setDataSourceRef,
      editingDataSourceRefId,
      setEditingDataSourceRefId,
      editingDataSourceRef,
    }),
    [
      features,
      dataSourceRefs,
      setDataSourceRef,
      editingDataSourceRefId,
      editingDataSourceRef,
    ],
  );
  return (
    <Slate
      editor={editor}
      initialValue={initialValue.nodes}
      onChange={(value) => onChange?.(value, dataSourceRefs)}
    >
      <TemplateEditorContext.Provider value={contextValue}>
        {children}
      </TemplateEditorContext.Provider>
    </Slate>
  );
}
