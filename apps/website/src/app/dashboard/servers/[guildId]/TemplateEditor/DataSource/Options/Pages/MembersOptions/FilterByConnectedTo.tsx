import type { DataSource } from "@mc/common/DataSource";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";
import { useTranslation } from "react-i18next";
import { Label } from "@mc/ui/label";
import type { Searchable } from "~/app/components/Combobox";
import type { DashboardGuildParams } from "~/app/dashboard/servers/[guildId]/layout";
import { Combobox } from "~/app/components/Combobox";
import { channelWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/channelWithDataSourceItem";
import { makeSercheableChannels } from "~/app/components/Combobox/sercheableMakers/makeSercheableChannels";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import { knownSearcheableDataSources } from "../../../dataSourcesMetadata";

type Type = (string | DataSource)[];
export function FilterByConnectedTo({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { t } = useTranslation();
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  const searchableChannels: Searchable<string | DataSource>[] = useMemo(() => {
    const voiceLikeChannels = new Map(
      [...(guild.data?.channels.entries() ?? [])].filter(
        ([_channelId, channel]) =>
          channel.type === ChannelType.GuildVoice ||
          channel.type === ChannelType.GuildStageVoice,
      ),
    );

    return [
      ...makeSercheableChannels(voiceLikeChannels),
      ...knownSearcheableDataSources,
    ];
  }, [guild.data?.channels]);

  return (
    <div>
      <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByConnectedTo.label')}</Label>
      {value.map((item, index) => (
        <Combobox
          key={index}
          items={searchableChannels}
          placeholder=""
          selectedItem={item}
          onItemSelect={(item) => {
            onChange(updateIn(value, item, index));
          }}
          onItemRender={channelWithDataSourceItemRendererFactory()}
          onSelectedItemRender={channelWithDataSourceItemRendererFactory({
            onUpdate: (item) => {
              onChange(updateIn(value, item, index));
            },
            onRemove: () => {
              onChange(removeFrom(value, index));
            },
            dataSourceConfigWarning: t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByConnectedTo.dataSourceConfigWarning')
          })}
        />
      ))}
      <Combobox
        items={searchableChannels}
        placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByConnectedTo.addPlaceholder')}
        onItemSelect={(item) => {
          onChange(addTo(value, item));
        }}
        onItemRender={channelWithDataSourceItemRendererFactory()}
      />
    </div>
  );
}
