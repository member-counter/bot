import type { DataSource } from "@mc/common/DataSource";

import type { ComboboxProps } from "..";
import { DataSourceItem } from "../items/DataSourceItem";
import { RoleItem } from "../items/RoleItem";

type T = string | DataSource;
type ItemProps = Parameters<ComboboxProps<T>["onItemRender"]>[0];

interface FactoryOpts {
  onUpdate?: (value: T) => void;
  onRemove?: () => void;
  dataSourceConfigWarning?: string;
}

export const roleWithDataSourceItemRendererFactory =
  (factoryOpts?: FactoryOpts) => (props: ItemProps) =>
    typeof props.item === "string" ? (
      <RoleItem {...props} {...factoryOpts} item={props.item} />
    ) : (
      <DataSourceItem {...props} {...factoryOpts} item={props.item} />
    );
