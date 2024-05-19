import type { DataSource } from "@mc/common/DataSource";

import { Input } from "@mc/ui/input";

import { DataSourceItem } from "../DataSourceItem";
import { TextItem } from "../TextItem";

export const AutocompleteTextItemRenderer = (
  item: string | DataSource,
  index: number,
  isSelected: boolean,
  onClick: () => void,
  label?: string,
) => {
  if (typeof item === "string") {
    return (
      <TextItem
        key={index}
        label={label ?? item}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  } else {
    return (
      <DataSourceItem
        key={index}
        dataSource={item}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }
};

export const textItemRendererFactory =
  ({
    remove,
    update,
    dataSourceConfigWarning,
  }: {
    update?: (value: string | DataSource, index: number) => void;
    remove?: (index: number) => void;
    dataSourceConfigWarning?: string;
  }) =>
  (item: string | DataSource, index: number) => {
    if (typeof item === "string") {
      return (
        <Input
          key={index}
          value={item}
          onBlur={({ target: { value } }) => {
            value.length === 0 && remove?.(index);
          }}
          onChange={({ target: { value } }) => {
            update && update(value, index);
          }}
        />
      );
    } else {
      return (
        <DataSourceItem
          key={index}
          dataSource={item}
          configWarning={dataSourceConfigWarning}
          onClickDelete={remove && (() => remove(index))}
          onChangeDataSource={
            update && ((dataSource) => update(dataSource, index))
          }
        />
      );
    }
  };
