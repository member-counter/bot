import type { DataSourceNumber } from "@mc/common/DataSource";
import { useTranslation } from "react-i18next";

import { Label } from "@mc/ui/label";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { useKnownSearcheableDataSource } from "../../metadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceNumber;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    number: options.number,
  };
};

export function NumberOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const { t } = useTranslation();
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  const knownSearcheableDataSources = useKnownSearcheableDataSource();

  return (
    <div>
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.NumberOptions.number",
          )}
        </Label>
        <Combobox
          items={knownSearcheableDataSources}
          selectedItem={options.number}
          allowSearchedTerm
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(number) {
              setOptions({ number });
            },
            onRemove() {
              setOptions({ number: undefined });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.NumberOptions.numberWarning",
            ),
          })}
          onItemSelect={(number) => {
            setOptions({ number });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.NumberOptions.placeholder",
          )}
        />
      </div>
    </div>
  );
}
