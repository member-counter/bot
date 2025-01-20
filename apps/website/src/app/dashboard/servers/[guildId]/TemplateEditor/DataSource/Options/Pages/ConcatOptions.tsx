import type { DataSource, DataSourceConcat } from "@mc/common/DataSource";
import { useTranslation } from "react-i18next";

import { Label } from "@mc/ui/label";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { useKnownSearcheableDataSource } from "../../metadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceConcat;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    strings: options.strings ?? [],
  };
};

export function ConcatOptions({
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
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ConcatOptions.stringList",
          )}
        </Label>
        {options.strings.map((string, index) => (
          <Combobox
            key={index}
            items={knownSearcheableDataSources}
            placeholder=""
            allowSearchedTerm
            prefillSelectedItemOnSearchOnFocus
            selectedItem={string}
            onItemSelect={(item) => {
              setOptions({
                strings: updateIn(options.strings, item, index),
              });
            }}
            onItemRender={textWithDataSourceItemRendererFactory()}
            onSelectedItemRender={textWithDataSourceItemRendererFactory({
              onUpdate: (item) => {
                setOptions({
                  strings: updateIn(options.strings, item, index),
                });
              },
              onRemove: () => {
                setOptions({ strings: removeFrom(options.strings, index) });
              },
              dataSourceConfigWarning: t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.numberWarning",
              ),
            })}
          />
        ))}
        <Combobox
          items={knownSearcheableDataSources}
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.addNumber",
          )}
          allowSearchedTerm
          onItemSelect={(item) => {
            setOptions({ strings: addTo(options.strings, item) });
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
        />
      </div>
    </div>
  );
}
