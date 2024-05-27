import type { DataSource, DataSourceClock } from "@mc/common/DataSource";
import { useMemo } from "react";

import { Label } from "@mc/ui/label";

import type { Searchable } from "../../../../../../../components/AutocompleteInput";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { searchableTimezones, timezones } from "~/other/timezones";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { DataSourceItem } from "./components/DataSourceItem";
import { TextItem } from "./components/TextItem";

type DataSourceType = DataSourceClock;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    timezone: options.timezone,
  };
};

export function ClockOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  const searchableTimezonesAndDataSources: Searchable<string | DataSource>[] =
    useMemo(() => [...searcheableDataSources, ...searchableTimezones], []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Label>Timezone</Label>
        {options.timezone &&
          [options.timezone].map(
            timezoneItemRenderer({
              remove: () => setOptions({ timezone: undefined }),
              update: (timezone) => setOptions({ timezone }),
              dataSourceConfigWarning:
                "Remember to return a valid IANA timezone",
            }),
          )}
        {!options.timezone && (
          <AutocompleteInput
            itemRenderer={AutocompleteTimezoneItemRenderer}
            placeholder="Search timezone..."
            onAdd={(timezone) => {
              setOptions({ timezone });
            }}
            suggestableItems={searchableTimezonesAndDataSources}
          />
        )}
      </div>
    </div>
  );
}

export const timezoneItemRenderer =
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
          label={timezones[item]?.label ?? item}
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

export const AutocompleteTimezoneItemRenderer = (
  item: string | DataSource,
  index: number,
  isSelected: boolean,
  onClick: () => void,
) => {
  if (typeof item === "string") {
    return (
      <TextItem
        key={index}
        label={timezones[item]?.label ?? item}
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
