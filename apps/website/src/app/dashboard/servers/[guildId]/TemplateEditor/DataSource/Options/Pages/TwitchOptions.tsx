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
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

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
    <div>
      <div>
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
      <Separator />
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
