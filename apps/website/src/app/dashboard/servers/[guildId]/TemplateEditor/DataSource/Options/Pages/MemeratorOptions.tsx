import type { DataSourceMemerator } from "@mc/common/DataSource";
import { FerrisWheelIcon, UserRoundPlusIcon } from "lucide-react";

import { MemeratorDataSourceReturn } from "@mc/common/DataSource";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { textItemRendererFactory } from "./components/itemRenderers/text";
import { AutocompleteTextReadonlyItemRenderer } from "./components/itemRenderers/textReadonly";

type DataSourceType = DataSourceMemerator;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    username: options.username ?? "",
    return: options.return ?? MemeratorDataSourceReturn.FOLLOWERS,
  };
};

export function MemeratorOptions({
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
      {" "}
      <div className="flex flex-col gap-3">
        <Label>Display</Label>
        <Select
          value={options.return.toString()}
          onValueChange={(value) => setOptions({ return: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select something to display" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={MemeratorDataSourceReturn.FOLLOWERS.toString()}
                label={"Followers"}
                icon={UserRoundPlusIcon}
              />
              <SelectItemWithIcon
                value={MemeratorDataSourceReturn.MEMES.toString()}
                label={"Memes"}
                icon={FerrisWheelIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-3">
        <Label>Username</Label>
        {options.username &&
          [options.username].map(
            textItemRendererFactory({
              remove: () => setOptions({ username: undefined }),
              update: (username) => setOptions({ username }),
              dataSourceConfigWarning: "Remember to return a valid username",
            }),
          )}
        {!options.username && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextReadonlyItemRenderer}
            placeholder=""
            onAdd={(username) => {
              setOptions({ username });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
    </div>
  );
}
