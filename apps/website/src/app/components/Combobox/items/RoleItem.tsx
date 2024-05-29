import { useParams } from "next/navigation";
import { CheckIcon, XIcon } from "lucide-react";

import type { ComboboxProps } from "..";
import type { DashboardGuildParams } from "~/app/dashboard/servers/[guildId]/layout";
import { mentionColor } from "~/other/mentionColor";
import { api } from "~/trpc/react";
import { TinyIconButton } from "../TinyIconButton";

const useRoleId = (id: string) => {
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  return guild.data?.roles.get(id);
};

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const RoleItem = ({ item, isSelected, onRemove }: Props) => {
  const role = useRoleId(item);

  const color = mentionColor(role?.color ?? 0xffffff);

  let name = role?.name;

  name ??= "Unknown role";

  if (name === "@everyone") name = "everyone";

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full overflow-auto">
        {isSelected && (
          <CheckIcon
            className="mr-2 inline-block h-5 w-5"
            aria-label="selected"
          />
        )}
        <div
          className="mr-auto overflow-hidden text-ellipsis whitespace-nowrap text-sm"
          style={{
            color: color.text,
          }}
        >
          {name ? "@ " + name : "Unknown role"}
        </div>
      </div>
      {onRemove && (
        <TinyIconButton
          icon={XIcon}
          onClick={onRemove}
          aria-label="Remove role"
        />
      )}
    </div>
  );
};
