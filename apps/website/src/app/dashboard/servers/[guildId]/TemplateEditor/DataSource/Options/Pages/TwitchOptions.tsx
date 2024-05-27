import type { DataSourceTwitch } from "@mc/common/DataSource";
import { EyeIcon, TagIcon, UserRoundPlusIcon } from "lucide-react";

import { TwitchDataSourceReturn } from "@mc/common/DataSource";
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

type DataSourceType = DataSourceTwitch;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    username: options.username ?? "",
    return: options.return ?? TwitchDataSourceReturn.FOLLOWERS,
  };
};

export function TwitchOptions({
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
                value={TwitchDataSourceReturn.FOLLOWERS.toString()}
                label={"Followers"}
                icon={UserRoundPlusIcon}
              />
              <SelectItemWithIcon
                value={TwitchDataSourceReturn.VIEWS.toString()}
                label={"Views"}
                icon={EyeIcon}
              />
              <SelectItemWithIcon
                value={TwitchDataSourceReturn.CHANNEL_NAME.toString()}
                label={"Channel name"}
                icon={TagIcon}
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
