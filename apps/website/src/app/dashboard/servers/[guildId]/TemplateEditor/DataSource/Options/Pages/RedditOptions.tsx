import type { DataSourceReddit } from "@mc/common/DataSource";
import { CircleIcon, TagIcon, UsersIcon } from "lucide-react";

import { RedditDataSourceReturn } from "@mc/common/DataSource";
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

type DataSourceType = DataSourceReddit;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    subreddit: options.subreddit ?? "",
    return: options.return ?? RedditDataSourceReturn.MEMBERS,
  };
};

export function RedditOptions({
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
                value={RedditDataSourceReturn.MEMBERS.toString()}
                label={"Members"}
                icon={UsersIcon}
              />
              <SelectItemWithIcon
                value={RedditDataSourceReturn.MEMBERS_ONLINE.toString()}
                label={"Members online"}
                icon={CircleIcon}
              />
              <SelectItemWithIcon
                value={RedditDataSourceReturn.TITLE.toString()}
                label={"Subreddit title"}
                icon={TagIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label>Subreddit name</Label>
        <Combobox
          items={knownSearcheableDataSources}
          selectedItem={options.subreddit}
          allowSearchedTerm
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(subreddit) {
              setOptions({ subreddit });
            },
            onRemove() {
              setOptions({ subreddit: undefined });
            },
            dataSourceConfigWarning: "Remember to return a valid subreddit",
          })}
          onItemSelect={(subreddit) => {
            setOptions({ subreddit });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder=""
        />
      </div>
    </div>
  );
}
