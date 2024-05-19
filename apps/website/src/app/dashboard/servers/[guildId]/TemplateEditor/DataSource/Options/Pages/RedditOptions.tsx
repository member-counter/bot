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

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { textItemRendererFactory } from "./components/itemRenderers/text";
import { AutocompleteTextReadonlyItemRenderer } from "./components/itemRenderers/textReadonly";

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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
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
      <div className="flex flex-col gap-1.5">
        <Label>Subreddit name</Label>
        {options.subreddit &&
          [options.subreddit].map(
            textItemRendererFactory({
              remove: () => setOptions({ subreddit: undefined }),
              update: (subreddit) => setOptions({ subreddit }),
              dataSourceConfigWarning: "Remember to return a valid username",
            }),
          )}
        {!options.subreddit && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextReadonlyItemRenderer}
            placeholder=""
            onAdd={(subreddit) => {
              setOptions({ subreddit });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
    </div>
  );
}
