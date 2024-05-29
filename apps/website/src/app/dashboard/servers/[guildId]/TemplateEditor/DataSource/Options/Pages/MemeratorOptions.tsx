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
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

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
