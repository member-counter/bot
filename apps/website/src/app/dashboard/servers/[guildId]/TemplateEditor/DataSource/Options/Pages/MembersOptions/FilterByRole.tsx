import type { DataSource } from "@mc/common/DataSource";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import type { Searchable } from "~/app/components/Combobox";
import type { DashboardGuildParams } from "~/app/dashboard/servers/[guildId]/layout";
import { Combobox } from "~/app/components/Combobox";
import { roleWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/roleWithDataSourceItem";
import { makeSercheableRoles } from "~/app/components/Combobox/sercheableMakers/makeSercheableRoles";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import { useKnownSearcheableDataSource } from "../../../metadata";

type Type = (string | DataSource)[];
export function FilterByRole({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { t } = useTranslation();
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  const knownSearcheableDataSources = useKnownSearcheableDataSource();

  const searchableRoles: Searchable<string | DataSource>[] = [
    ...makeSercheableRoles(guild.data?.roles),
    ...knownSearcheableDataSources,
  ];

  return (
    <>
      {value.map((item, index) => (
        <Combobox
          key={index}
          items={searchableRoles}
          placeholder=""
          selectedItem={item}
          onItemSelect={(item) => {
            onChange(updateIn(value, item, index));
          }}
          onItemRender={roleWithDataSourceItemRendererFactory()}
          onSelectedItemRender={roleWithDataSourceItemRendererFactory({
            onUpdate: (item) => {
              onChange(updateIn(value, item, index));
            },
            onRemove: () => {
              onChange(removeFrom(value, index));
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByRole.dataSourceConfigWarning",
            ),
          })}
        />
      ))}
      <Combobox
        items={searchableRoles}
        placeholder={t(
          "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByRole.addPlaceholder",
        )}
        onItemSelect={(item) => {
          onChange(addTo(value, item));
        }}
        onItemRender={roleWithDataSourceItemRendererFactory()}
      />
    </>
  );
}
