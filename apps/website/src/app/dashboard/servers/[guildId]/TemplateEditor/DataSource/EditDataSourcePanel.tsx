import type { DataSource } from "@mc/common/DataSource";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import type { DataSourceRefId } from "../utils";
import type { EditDataSourceProps } from "./Options/EditDataSourceOptions";
import { blurredBackground } from "~/other/common-styles";
import { getDataSourceMetadata } from "./dataSourcesMetadata";
import { NestedDataSourceBreadcrumb } from "./EditDataSourcePanelBreadcrumb";
import { EditDataSourcePanelContext } from "./EditDataSourcePanelContext";
import DataSourceFormat from "./Format/DataSourceFormat";
import { EditDataSourceOptions } from "./Options/EditDataSourceOptions";

interface Props {
  dataSource: DataSource;
  dataSourceRefId: DataSourceRefId;
  onChangeDataSource: (dataSource: DataSource) => void;
  onClose: () => void;
}

export default function EditDataSourcePanel({
  dataSource,
  onClose,
  onChangeDataSource,
  dataSourceRefId,
}: Props): JSX.Element {
  const [editStack, setEditStack] = useState<EditDataSourceProps[]>([]);
  const [formattingSettingsCollapsed, setFormattingSettingsCollapsed] =
    useState(true);

  useEffect(() => {
    setEditStack([{ dataSource, onChangeDataSource }]);
  }, [dataSource, dataSourceRefId, onChangeDataSource]);

  const rootMetadata = useMemo(
    () => getDataSourceMetadata(dataSource.id),
    [dataSource.id],
  );

  const editDataSourceContext = {
    pushEditStack: (stackItem: EditDataSourceProps) => {
      const newStack = [...editStack];
      newStack.push(stackItem);
      setEditStack(newStack);
    },
    popEditStack: (amount = 1) => {
      const newStack = [...editStack];
      newStack.splice(-amount, amount);
      setEditStack(newStack);
    },
  };

  const navigateTo = (index: number) => {
    const newStack = [...editStack];
    newStack.splice(index + 1);
    setEditStack(newStack);
  };

  return (
    <EditDataSourcePanelContext.Provider value={editDataSourceContext}>
      <div className="flex h-full flex-col overflow-hidden">
        <div className={"flex w-full flex-row items-center gap-1 border-b p-1"}>
          <div className="flex h-10 w-10 items-center justify-center">
            {editStack.length > 1 ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editDataSourceContext.popEditStack()}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            ) : (
              <rootMetadata.icon className="my-auto h-4 w-4" />
            )}
          </div>
          <NestedDataSourceBreadcrumb
            editStack={editStack}
            navigateTo={navigateTo}
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto flex-none"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="grow overflow-auto">
          {editStack.map((editItem, i) => {
            const isLastItem = editStack.length - 1 === i;
            return (
              <div
                className={isLastItem ? " flex flex-col gap-1 p-3" : "hidden"}
                key={i}
              >
                <EditDataSourceOptions
                  dataSource={editItem.dataSource}
                  onChangeDataSource={(dataSource) => {
                    editItem.dataSource = dataSource;
                    editItem.onChangeDataSource(editItem.dataSource);
                    setEditStack([...editStack]);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div
          className={cn([
            blurredBackground,
            "sticky bottom-0 z-50 flex w-full flex-col gap-1 border-t p-1",
          ])}
        >
          <div className="flex w-full flex-row items-center">
            <div className="flex h-10 w-10 items-center justify-center">
              <WrenchIcon className="my-auto h-4 w-4" />
            </div>
            <div className="flex-grow font-normal text-foreground">
              Format settings
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setFormattingSettingsCollapsed(!formattingSettingsCollapsed)
              }
            >
              {formattingSettingsCollapsed ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          {!formattingSettingsCollapsed && editStack[0] && (
            <div className="flex flex-col gap-1 p-3">
              <DataSourceFormat
                format={editStack[0].dataSource.format ?? {}}
                onChangeFormat={(format) => {
                  if (!editStack[0]) return;
                  editStack[0].dataSource.format = format;
                  editStack[0].onChangeDataSource(editStack[0].dataSource);
                  setEditStack([...editStack]);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </EditDataSourcePanelContext.Provider>
  );
}
