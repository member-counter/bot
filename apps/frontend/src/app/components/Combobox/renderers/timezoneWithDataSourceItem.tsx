import type { DataSource } from "@mc/common/DataSource";

import type { ComboboxProps } from "..";
import { DataSourceItem } from "../items/DataSourceItem";
import { TimezoneItem } from "../items/TimezoneItem";

type T = string | DataSource;
type ItemProps = Parameters<ComboboxProps<T>["onItemRender"]>[0];

interface FactoryOpts {
  onUpdate?: (value: T) => void;
  onRemove?: () => void;
  dataSourceConfigWarning?: string;
}

export const timezoneWithDataSourceItem =
  (factoryOpts?: FactoryOpts) => (props: ItemProps) =>
    typeof props.item === "string" ? (
      <TimezoneItem {...props} {...factoryOpts} item={props.item} />
    ) : (
      <DataSourceItem {...props} {...factoryOpts} item={props.item} />
    );
