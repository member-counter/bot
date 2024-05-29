import type { DataSourceNumber } from "@mc/common/DataSource";

import { Label } from "@mc/ui/label";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
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
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  return (
    <div>
      <div>
        <Label>Number</Label>
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
            dataSourceConfigWarning: "Remember to return a valid number",
          })}
          onItemSelect={(number) => {
            setOptions({ number });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder="Enter a number or search a counter"
        />
      </div>
    </div>
  );
}
