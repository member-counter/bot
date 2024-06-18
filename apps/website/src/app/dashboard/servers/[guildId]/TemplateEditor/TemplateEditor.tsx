"use client";

import type { Grammar } from "prismjs";
import type { ReactNode } from "react";
import type { Descendant } from "slate";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

export default function TemplateEditor({
  initialValue = {
    nodes: defaultInitialEditorValue,
    dataSourceRefs: new Map(),
  },
  onChange: unrefedOnChange,
  features,
  textarea,
  children,
  disabled,
}: {
  textarea?: boolean;
  initialValue?: { nodes: Descendant[]; dataSourceRefs: DataSourceRefs };
  onChange?: (nodes: Descendant[], dataSourceRefs: DataSourceRefs) => void;
  features: Grammar;
  children: ReactNode;
  disabled?: boolean;
}): JSX.Element {
  // A dirty way to fix the dirty forms
  const [dirtyFix, setDirtyFix] = useState(3);
  const [editor] = useState(buildEditor(features, textarea));
  const onChangeRef = useRef(unrefedOnChange);
  const [dataSourceRefs, setDataSourceRef] = useDataSourceReducer({
    initialDataSourceRefs: initialValue.dataSourceRefs,
  });

  useEffect(() => {
    if (dirtyFix) return setDirtyFix(dirtyFix - 1);
    onChangeRef.current?.(editor.children, dataSourceRefs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceRefs, editor.children]);

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
      onChangeRef.current?.(value, dataSourceRefs);
    },
    [dataSourceRefs],
  );

  return (
    <Slate
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
