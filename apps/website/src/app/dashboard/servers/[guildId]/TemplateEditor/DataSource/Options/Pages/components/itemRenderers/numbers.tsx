import type { DataSource } from "@mc/common/DataSource";

import { Input } from "@mc/ui/input";

import { DataSourceItem } from "../DataSourceItem";
import { TextItem } from "../TextItem";

export const convertNumber = (
  n: string | DataSource | number,
  oldNumber: DataSource | number = 0,
): DataSource | number => {
  if (typeof n === "string") {
    let correctedNumber = n;
    correctedNumber = correctedNumber.replace(",", ".");
    correctedNumber = correctedNumber.replace(/[^0-9\\.]/g, "");
    const number = Number(correctedNumber);

    if (isNaN(number)) return oldNumber;
    else return number;
  } else {
    return n;
  }
};

export const AutocompleteNumberItemRenderer = (
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

export const numberItemRendererFactory =
  ({
    remove,
    update,
  }: {
    update: (value: number | DataSource, index: number) => void;
    remove: (index: number) => void;
    dataSourceConfigWarning?: string;
  }) =>
  (item: number | DataSource, index: number) => {
    if (typeof item === "number") {
      return (
        <Input
          type="number"
          key={index}
          value={item}
          onKeyDown={(event) => {
            event.currentTarget.value.length === 1 &&
              ["Delete", "Backspace"].includes(event.key) &&
              remove(index);
          }}
          onChange={({ target: { valueAsNumber } }) => {
            if (!isNaN(valueAsNumber)) {
              update(valueAsNumber, index);
            }
          }}
        />
      );
    } else {
      return (
        <DataSourceItem
          key={index}
          dataSource={item}
          configWarning="Remember to return a valid number"
          onClickDelete={() => remove(index)}
          onChangeDataSource={(dataSource) => update(dataSource, index)}
        />
      );
    }
  };
