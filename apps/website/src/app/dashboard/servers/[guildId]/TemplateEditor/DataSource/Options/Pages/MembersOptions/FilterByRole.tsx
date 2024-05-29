import type { DataSource } from "@mc/common/DataSource";
import { useParams } from "next/navigation";

import type { Searchable } from "~/app/components/Combobox";
import type { DashboardGuildParams } from "~/app/dashboard/servers/[guildId]/layout";
import { Combobox } from "~/app/components/Combobox";
import { roleWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/roleWithDataSourceItem";
import { makeSercheableRoles } from "~/app/components/Combobox/sercheableMakers/makeSercheableRoles";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import { knownSearcheableDataSources } from "../../../dataSourcesMetadata";

type Type = (string | DataSource)[];
export function FilterByRole({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const searchableRoles: Searchable<string | DataSource>[] = [
    ...makeSercheableRoles(guild.data?.roles),
    ...knownSearcheableDataSources,
  ];

  return (
    <>
      {value.map((item, index) => (
        <Combobox
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
            dataSourceConfigWarning: "Remember to return a valid role ID",
          })}
        />
      ))}
      <Combobox
        items={searchableRoles}
        placeholder="Add role..."
        onItemSelect={(item) => {
          onChange(addTo(value, item));
        }}
        onItemRender={roleWithDataSourceItemRendererFactory()}
      />
    </>
  );
}
