import type { DataSource } from "@mc/common/DataSource";

import { DataSourceItem } from "../DataSourceItem";
import { RoleItem } from "../RoleItem";

export const AutocompleteRoleItemRenderer = (
  item: string | DataSource,
  index: number,
  isSelected: boolean,
  onClick: () => void,
) => {
  if (typeof item === "string") {
    return (
      <RoleItem
        key={index}
        role={item}
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

export const roleItemRendererFactory =
  ({
    remove,
    update,
  }: {
    update: (value: string | DataSource, index: number) => void;
    remove: (index: number) => void;
  }) =>
  (item: string | DataSource, index: number) => {
    if (typeof item === "string") {
      return (
        <RoleItem key={index} role={item} onClickDelete={() => remove(index)} />
      );
    } else {
      return (
        <DataSourceItem
          key={index}
          dataSource={item}
          configWarning="Remember to return a valid role ID"
          onClickDelete={() => remove(index)}
          onChangeDataSource={(dataSource) => update(dataSource, index)}
        />
      );
    }
  };
