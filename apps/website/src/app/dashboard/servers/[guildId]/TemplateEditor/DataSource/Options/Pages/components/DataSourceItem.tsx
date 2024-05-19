import type { DataSource } from "@mc/common/DataSource";
import { useContext, useMemo } from "react";
import { SettingsIcon, XIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import { InfoToolip } from "../../../../../../../../components/InfoTooltip";
import { getDataSourceMetadata } from "../../../dataSourcesMetadata";
import { EditDataSourcePanelContext } from "../../../EditDataSourcePanelContext";

export const DataSourceItem = ({
  onClick,
  dataSource,
  onChangeDataSource,
  onClickDelete,
  isSelected,
  configWarning,
}: {
  onClick?: () => void;
  dataSource: DataSource;
  onChangeDataSource?: (dataSource: DataSource) => void;
  onClickDelete?: () => void;
  isSelected?: boolean;
  configWarning?: string;
}) => {
  const { pushEditStack } = useContext(EditDataSourcePanelContext);
  const metadata = useMemo(
    () => getDataSourceMetadata(dataSource.id),
    [dataSource.id],
  );

  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn([
        "flex h-[40px] flex-row items-center rounded-md border border-input bg-background pl-3 hover:bg-accent hover:text-accent-foreground",
        {
          "bg-accent text-accent-foreground": isSelected,
          "cursor-pointer": !!onClick,
        },
      ])}
    >
      <metadata.icon className="mr-2 h-3 w-3" />
      <div className="mr-auto truncate">{metadata.displayName(dataSource)}</div>
      <div className="flex flex-row items-center">
        {onChangeDataSource && (
          <InfoToolip text={configWarning}>
            <Button
              size="sm"
              variant="none"
              onClick={() =>
                pushEditStack({
                  dataSource,
                  onChangeDataSource,
                })
              }
            >
              <SettingsIcon className="h-3 w-3" />
            </Button>
          </InfoToolip>
        )}
        {onClickDelete && (
          <Button size="sm" variant="none" onClick={onClickDelete}>
            <XIcon className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
