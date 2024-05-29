import type { DataSource, DataSourceChannels } from "@mc/common/DataSource";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";

import { Label } from "@mc/ui/label";

import type { DashboardGuildParams } from "../../../../layout";
import type { GuildChannel } from "../../../d-types";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import type { Searchable } from "~/app/components/Combobox";
import { Combobox } from "~/app/components/Combobox";
import { channelWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/channelWithDataSourceItem";
import { makeSercheableChannels } from "~/app/components/Combobox/sercheableMakers/makeSercheableChannels";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

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

  const searchableCategories: Searchable<string | DataSource>[] =
    useMemo(() => {
      const categories = new Map(
        [...channels.entries()].filter(
          ([_channelId, channel]) => channel.type === ChannelType.GuildCategory,
        ),
      );

      return [
        ...makeSercheableChannels(categories),
        ...knownSearcheableDataSources,
      ];
    }, [channels]);

  return (
    <div>
      <div>
        <Label>Filter by category</Label>
        {options.categories.map((item, index) => (
          <Combobox
            key={index}
            items={searchableCategories}
            placeholder=""
            selectedItem={item}
            onItemSelect={(item) => {
              setOptions({
                categories: updateIn(options.categories, item, index),
              });
            }}
            onItemRender={channelWithDataSourceItemRendererFactory()}
            onSelectedItemRender={channelWithDataSourceItemRendererFactory({
              onUpdate: (item) => {
                setOptions({
                  categories: updateIn(options.categories, item, index),
                });
              },
              onRemove: () => {
                setOptions({
                  categories: removeFrom(options.categories, index),
                });
              },
              dataSourceConfigWarning: "Remember to return a valid category ID",
            })}
          />
        ))}
        <Combobox
          items={searchableCategories}
          placeholder="Add category..."
          onItemSelect={(item) => {
            setOptions({
              categories: addTo(options.categories, item),
            });
          }}
          onItemRender={channelWithDataSourceItemRendererFactory()}
        />
      </div>
    </div>
  );
}
