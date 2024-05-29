import type { DataSourceTwitter } from "@mc/common/DataSource";

import { Label } from "@mc/ui/label";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceTwitter;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    username: options.username ?? "",
  };
};

export function TwitterOptions({
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
        <Label>Username</Label>
        <Combobox
          items={knownSearcheableDataSources}
          selectedItem={options.username}
          allowSearchedTerm
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(username) {
              setOptions({ username });
            },
            onRemove() {
              setOptions({ username: undefined });
            },
            dataSourceConfigWarning: "Remember to return a valid username",
          })}
          onItemSelect={(username) => {
            setOptions({ username });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder=""
        />
      </div>
    </div>
  );
}
