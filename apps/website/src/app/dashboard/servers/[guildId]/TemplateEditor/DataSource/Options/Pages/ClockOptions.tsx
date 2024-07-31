import type { DataSource, DataSourceClock } from "@mc/common/DataSource";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@mc/ui/label";

import type { Searchable } from "../../../../../../../components/Combobox";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { timezoneWithDataSourceItem } from "~/app/components/Combobox/renderers/timezoneWithDataSourceItem";
import { searchableTimezones } from "~/other/timezones";
import { Combobox } from "../../../../../../../components/Combobox";
import { useSearcheableDataSource } from "../../metadata";
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
  const { t } = useTranslation();
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });
  const searcheableDataSources = useSearcheableDataSource();

  const searchableTimezonesAndDataSources: Searchable<string | DataSource>[] =
    useMemo(
      () => [...searchableTimezones, ...searcheableDataSources],
      [searcheableDataSources],
    );

  return (
    <div>
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.timezone",
          )}
        </Label>
        <Combobox
          items={searchableTimezonesAndDataSources}
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.searchTimezonePlaceholder",
          )}
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
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.configWarning",
            ),
          })}
        />
      </div>
    </div>
  );
}
