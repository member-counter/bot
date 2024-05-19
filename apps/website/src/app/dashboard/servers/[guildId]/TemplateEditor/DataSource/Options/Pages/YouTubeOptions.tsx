import type { DataSourceYoutube } from "@mc/common/DataSource";
import { EyeIcon, TagIcon, UserRoundPlusIcon, VideoIcon } from "lucide-react";

import { YouTubeDataSourceReturn } from "@mc/common/DataSource";
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

type DataSourceType = DataSourceYoutube;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    channelUrl: options.channelUrl ?? "",
    return: options.return ?? YouTubeDataSourceReturn.SUBSCRIBERS,
  };
};

export function YouTubeOptions({
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
                value={YouTubeDataSourceReturn.SUBSCRIBERS.toString()}
                label={"Subscribers"}
                icon={UserRoundPlusIcon}
              />
              <SelectItemWithIcon
                value={YouTubeDataSourceReturn.VIEWS.toString()}
                label={"Views"}
                icon={EyeIcon}
              />
              <SelectItemWithIcon
                value={YouTubeDataSourceReturn.VIDEOS.toString()}
                label={"Videos"}
                icon={VideoIcon}
              />
              <SelectItemWithIcon
                value={YouTubeDataSourceReturn.CHANNEL_NAME.toString()}
                label={"Channel name"}
                icon={TagIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Channel URL</Label>
        {options.channelUrl &&
          [options.channelUrl].map(
            textItemRendererFactory({
              remove: () => setOptions({ channelUrl: undefined }),
              update: (channelUrl) => setOptions({ channelUrl }),
              dataSourceConfigWarning: "Remember to return a valid channel URL",
            }),
          )}
        {!options.channelUrl && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextReadonlyItemRenderer}
            placeholder=""
            onAdd={(channelUrl) => {
              setOptions({ channelUrl });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
    </div>
  );
}
