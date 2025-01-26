"use client";

import type { Grammar } from "prismjs";
import type { ReactNode } from "react";
import type { Descendant } from "slate";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Slate } from "slate-react";
import { v4 } from "uuid";

import type { DataSourceRefId, DataSourceRefs } from "./utils";
import { DataSourceRefsContext } from "./DataSource/DataSourceRefs";
import { TemplateEditorContext } from "./TemplateEditorContext";
import {
  buildEditor,
  defaultInitialEditorValue,
  useDataSourceReducer,
} from "./utils";

export default function SlateTemplateEditor({
  key,
  initialValue = {
    nodes: defaultInitialEditorValue,
    dataSourceRefs: new Map(),
  },
  onChange,
  features,
  textarea,
  children,
  disabled,
}: {
  key?: string;
  textarea?: boolean;
  initialValue?: { nodes: Descendant[]; dataSourceRefs: DataSourceRefs };
  onChange?: (nodes: Descendant[], dataSourceRefs: DataSourceRefs) => void;
  features: Grammar;
  children: ReactNode;
  disabled?: boolean;
}): JSX.Element {
  const [editor] = useState(buildEditor(features, textarea));
  const [dataSourceRefs, setDataSourceRef] = useDataSourceReducer({
    initialDataSourceRefs: initialValue.dataSourceRefs,
  });

  const [editingDataSourceRefId, setEditingDataSourceRefId] =
    useState<DataSourceRefId | null>(null);

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

  const templateEditorContextValue = useMemo(
    () => ({
      features,
      disabled: !!disabled,
    }),
    [features, disabled],
  );

  const dataSourceRefsContextValue = useMemo(
    () => ({
      dataSourceRefs,
      setDataSourceRef,
      editingDataSourceRefId,
      setEditingDataSourceRefId,
    }),
    [dataSourceRefs, setDataSourceRef, editingDataSourceRefId],
  );

  const slateOnChangeCallback = useCallback(
    (value: Descendant[]) => {
      onChange?.(value, dataSourceRefs);
    },
    [dataSourceRefs, onChange],
  );

  useEffect(() => {
    onChange?.(editor.children, dataSourceRefs);
  }, [dataSourceRefs, editor.children, onChange]);

  return (
    <Slate
      key={key}
      editor={editor}
      initialValue={initialValue.nodes}
      onChange={slateOnChangeCallback}
    >
      <TemplateEditorContext.Provider value={templateEditorContextValue}>
        <DataSourceRefsContext.Provider value={dataSourceRefsContextValue}>
          {children}
        </DataSourceRefsContext.Provider>
      </TemplateEditorContext.Provider>
    </Slate>
  );
}
