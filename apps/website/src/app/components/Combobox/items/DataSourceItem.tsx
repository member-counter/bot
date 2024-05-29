import type { DataSource } from "@mc/common/DataSource";
import { useContext } from "react";
import { CheckIcon, Settings2Icon, XIcon } from "lucide-react";

import { DataSourceId } from "@mc/common/DataSource";

import type { ComboboxProps } from "..";
import type { DataSourceMetadata } from "~/app/dashboard/servers/[guildId]/TemplateEditor/DataSource/dataSourcesMetadata";
import { getDataSourceMetadata } from "~/app/dashboard/servers/[guildId]/TemplateEditor/DataSource/dataSourcesMetadata";
import { EditDataSourcePanelContext } from "~/app/dashboard/servers/[guildId]/TemplateEditor/DataSource/EditDataSourcePanelContext";
import { InfoToolip } from "../../InfoTooltip";
import { TinyIconButton } from "../TinyIconButton";

type Props = Parameters<ComboboxProps<DataSource>["onItemRender"]>[0] & {
  onUpdate?: (item: DataSource) => void;
  onRemove?: () => void;
  dataSourceConfigWarning?: string;
};

export const DataSourceItem = ({
  item,
  isSelected,
  onUpdate,
  onRemove,
  dataSourceConfigWarning,
}: Props) => {
  const { pushEditStack } = useContext(EditDataSourcePanelContext);

  let dataSourceMetadata: DataSourceMetadata;

  try {
    dataSourceMetadata = getDataSourceMetadata(item.id);
  } catch {
    dataSourceMetadata = getDataSourceMetadata(DataSourceId.UNKNOWN);
  }

  const displayName = dataSourceMetadata.displayName(item);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center overflow-auto">
        {isSelected ? (
          <CheckIcon
            className="mr-2 inline-block h-5 w-5"
            aria-label="selected"
          />
        ) : (
          <dataSourceMetadata.icon
            className="mr-2 inline-block h-5 w-5 min-w-5"
            aria-label="selected"
          />
        )}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {displayName}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {onUpdate && (
          <InfoToolip text={dataSourceConfigWarning}>
            <TinyIconButton
              icon={Settings2Icon}
              onClick={() => {
                pushEditStack({
                  dataSource: item,
                  onChangeDataSource: onUpdate,
                });
              }}
            />
          </InfoToolip>
        )}
        {onRemove && (
          <TinyIconButton
            icon={XIcon}
            onClick={onRemove}
            aria-label="Remove counter"
          />
        )}
      </div>
    </div>
  );
};
