import type { DataSource } from "@mc/common/DataSource";

import { ChannelItem } from "../ChannelItem";
import { DataSourceItem } from "../DataSourceItem";

export const AutocompleteChannelItemRenderer = (
  item: string | DataSource,
  index: number,
  isSelected: boolean,
  onClick: () => void,
) => {
  if (typeof item === "string") {
    return (
      <ChannelItem
        key={index}
        channel={item}
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

export const channelItemRendererFactory =
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
        <ChannelItem
          key={index}
          channel={item}
          onClickDelete={() => remove(index)}
        />
      );
    } else {
      return (
        <DataSourceItem
          key={index}
          dataSource={item}
          configWarning="Remember to return a valid channel ID (string)"
          onClickDelete={() => remove(index)}
          onChangeDataSource={(dataSource) => update(dataSource, index)}
        />
      );
    }
  };
