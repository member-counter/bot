"use client";

import { useContext, useEffect, useState } from "react";
import { BracesIcon } from "lucide-react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { DataSourceId } from "@mc/common/DataSource";
import { Button } from "@mc/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mc/ui/resizable";
import { Separator } from "@mc/ui/separator";

import AddDataSourcePanel from "../DataSource/AddDataSourcePanel";
import EditDataSourcePanel from "../DataSource/EditDataSourcePanel";
import { insertDataSource } from "../DataSource/insertDataSource";
import { EmojiPicker } from "../Emoji/EmojiPicker";
import { MarkButtons } from "../Marks/MarkButtons";
import { MentionSuggestions } from "../Mention/MentionSuggestions";
import { TemplateEditorContext } from "../TemplateEditorContext";
import TemplateEditorInput from "../TemplateEditorInput";

export enum TemplateEditorPanel {
  CLOSED,
  ADD,
  EDIT,
}

export default function ChannelTopicEditorDesktopLayout(): JSX.Element {
  const editor = useSlateStatic();
  const {
    editingDataSourceRefId,
    setEditingDataSourceRefId,
    setDataSourceRef,
    editingDataSourceRef,
  } = useContext(TemplateEditorContext);

  const [templateEditorPanel, setTemplateEditorPanel] =
    useState<TemplateEditorPanel>(TemplateEditorPanel.CLOSED);

  useEffect(() => {
    if (editingDataSourceRefId)
      setTemplateEditorPanel(TemplateEditorPanel.EDIT);
  }, [editingDataSourceRefId]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        id="edit-template-input"
        minSize={30}
        order={1}
        onClick={() => ReactEditor.focus(editor)}
      >
        <div className="flex flex-col">
          <div className="flex flex-row gap-1 p-1">
            <MarkButtons />
            <Separator orientation="vertical" className="my-1 h-auto" />
            <EmojiPicker />
            {!templateEditorPanel && (
              <Button
                className="ml-auto"
                onClick={() => setTemplateEditorPanel(TemplateEditorPanel.ADD)}
              >
                <BracesIcon className="mr-2 h-4 w-4" /> Add counter
              </Button>
            )}
          </div>
          <Separator />
          <div className="p-4">
            <MentionSuggestions>
              <TemplateEditorInput></TemplateEditorInput>
            </MentionSuggestions>
          </div>
        </div>
      </ResizablePanel>
      {!!templateEditorPanel && (
        <>
          <ResizableHandle />
          <ResizablePanel
            id="data-source-add-edit"
            minSize={30}
            defaultSize={30}
            order={2}
          >
            {templateEditorPanel === TemplateEditorPanel.ADD && (
              <AddDataSourcePanel
                onAdd={(dataSourceId) => {
                  setEditingDataSourceRefId(
                    insertDataSource(editor, dataSourceId, setDataSourceRef),
                  );
                  setTemplateEditorPanel(TemplateEditorPanel.EDIT);
                }}
                onClose={() =>
                  setTemplateEditorPanel(TemplateEditorPanel.CLOSED)
                }
              />
            )}
            {templateEditorPanel === TemplateEditorPanel.EDIT &&
              editingDataSourceRefId && (
                <EditDataSourcePanel
                  dataSource={
                    editingDataSourceRef ?? { id: DataSourceId.UNKNOWN }
                  }
                  dataSourceRefId={editingDataSourceRefId}
                  onChangeDataSource={(dataSource) => {
                    if (!editingDataSourceRefId) return;
                    setDataSourceRef([editingDataSourceRefId, dataSource]);
                  }}
                  onClose={() => {
                    setTemplateEditorPanel(TemplateEditorPanel.CLOSED);
                    setEditingDataSourceRefId(null);
                  }}
                />
              )}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
