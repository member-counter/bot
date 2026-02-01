import type { DataSource } from "@mc/common/DataSource";

import type { ComboboxProps } from "..";
import { ChannelItem } from "../items/ChannelItem";
import { DataSourceItem } from "../items/DataSourceItem";

type T = string | DataSource;
type ItemProps = Parameters<ComboboxProps<T>["onItemRender"]>[0];

interface FactoryOpts {
  onUpdate?: (value: T) => void;
  onRemove?: () => void;
  dataSourceConfigWarning?: string;
}

export const channelWithDataSourceItemRendererFactory =
  (factoryOpts?: FactoryOpts) => (props: ItemProps) =>
    typeof props.item === "string" ? (
      <ChannelItem {...props} {...factoryOpts} item={props.item} />
    ) : (
      <DataSourceItem {...props} {...factoryOpts} item={props.item} />
    );
