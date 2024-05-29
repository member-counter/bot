import type { DataSource, DataSourceClock } from "@mc/common/DataSource";
import { useMemo } from "react";

import { Label } from "@mc/ui/label";

import type { Searchable } from "../../../../../../../components/Combobox";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { timezoneWithDataSourceItem } from "~/app/components/Combobox/renderers/timezoneWithDataSourceItem";
import { searchableTimezones } from "~/other/timezones";
import { Combobox } from "../../../../../../../components/Combobox";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

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
    useMemo(() => [...searchableTimezones, ...searcheableDataSources], []);

  return (
    <div>
      <div>
        <Label>Timezone</Label>
        <Combobox
          items={searchableTimezonesAndDataSources}
          placeholder="Search timezone..."
          selectedItem={options.timezone}
          onItemSelect={(item) => {
            setOptions({
              timezone: item,
            });
          }}
          onItemRender={timezoneWithDataSourceItem()}
          onSelectedItemRender={timezoneWithDataSourceItem({
            onUpdate: (item) => {
              setOptions({
                timezone: item,
              });
            },
            onRemove: () => {
              setOptions({
                timezone: undefined,
              });
            },
            dataSourceConfigWarning:
              "Remember to return a valid timezone indentifier",
          })}
        />
      </div>
    </div>
  );
}
