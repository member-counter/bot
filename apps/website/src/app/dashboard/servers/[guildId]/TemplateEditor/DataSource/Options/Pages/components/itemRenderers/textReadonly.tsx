import type { DataSource } from "@mc/common/DataSource";

import { DataSourceItem } from "../DataSourceItem";
import { TextItem } from "../TextItem";

export const AutocompleteTextReadonlyItemRenderer = (
  item: string | DataSource,
  index: number,
  isSelected: boolean,
  onClick: () => void,
) => {
  if (typeof item === "string") {
    return (
      <TextItem
        key={index}
        label={item}
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

export const textReadonlyItemRenderer =
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
        <TextItem
          key={index}
          label={item}
          onClickDelete={remove && (() => remove(index))}
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
