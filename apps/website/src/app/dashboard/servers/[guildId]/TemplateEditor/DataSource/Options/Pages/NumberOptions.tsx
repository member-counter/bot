import type { DataSourceNumber } from "@mc/common/DataSource";

import { Label } from "@mc/ui/label";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { textItemRendererFactory } from "./components/itemRenderers/text";
import { AutocompleteTextReadonlyItemRenderer } from "./components/itemRenderers/textReadonly";

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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>Number</Label>
        {options.number &&
          [options.number].map(
            textItemRendererFactory({
              remove: () => setOptions({ number: undefined }),
              update: (number) => setOptions({ number }),
            }),
          )}
        {!options.number && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextReadonlyItemRenderer}
            placeholder="Enter a number or search a counter..."
            onAdd={(number) => {
              setOptions({ number });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
    </div>
  );
}
