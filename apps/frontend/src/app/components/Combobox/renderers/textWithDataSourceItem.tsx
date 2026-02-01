import type { DataSource } from "@mc/common/DataSource";

import type { ComboboxProps } from "..";
import { DataSourceItem } from "../items/DataSourceItem";
import { TextItem } from "../items/TextItem";

type Type<T> = T | DataSource;
type ItemProps<T> = Parameters<ComboboxProps<Type<T>>["onItemRender"]>[0];

interface FactoryOpts<T> {
  onUpdate?: (value: Type<T>) => void;
  onRemove?: () => void;
  dataSourceConfigWarning?: string;
}

export const textWithDataSourceItemRendererFactory =
  <T extends { toString(): string }>(factoryOpts?: FactoryOpts<T>) =>
  (props: ItemProps<T>) =>
    typeof props.item === "object" && "id" in props.item ? (
      <DataSourceItem {...props} {...factoryOpts} item={props.item} />
    ) : (
      <TextItem {...props} {...factoryOpts} item={props.item.toString()} />
    );
