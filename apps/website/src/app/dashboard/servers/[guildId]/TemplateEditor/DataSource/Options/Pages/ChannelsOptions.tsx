import type { DataSource, DataSourceChannels } from "@mc/common/DataSource";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";

import { Label } from "@mc/ui/label";

import type { Searchable } from "../../../../../../../components/AutocompleteInput";
import type { DashboardGuildParams } from "../../../../layout";
import type { GuildChannel } from "../../../d-types";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import {
  AutocompleteChannelItemRenderer,
  channelItemRendererFactory,
} from "./components/itemRenderers/channels";

type DataSourceType = DataSourceChannels;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    categories: options.categories ?? [],
  };
};

export function ChannelOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channels = useMemo(
    () => guild.data?.channels ?? new Map<string, GuildChannel>(),
    [guild.data],
  );

  const searchableCategories: Searchable<string | DataSource>[] = useMemo(
    () => [
      ...searcheableDataSources,
      ...Array.from(channels.values())
        .filter((channel) => channel.type === ChannelType.GuildCategory)
        .map((channel) => ({ value: channel.id, keywords: [channel.name] })),
    ],
    [channels],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Label>Filter by category</Label>
        {options.categories.map(
          channelItemRendererFactory({
            remove: (index) =>
              setOptions({ categories: removeFrom(options.categories, index) }),
            update: (item, index) =>
              setOptions({
                categories: updateIn(options.categories, item, index),
              }),
          }),
        )}
        <AutocompleteInput
          itemRenderer={AutocompleteChannelItemRenderer}
          placeholder="Add category..."
          onAdd={(item) => {
            setOptions({ categories: addTo(options.categories, item) });
          }}
          suggestOnFocus={false}
          suggestableItems={searchableCategories}
        />
      </div>
    </div>
  );
}
