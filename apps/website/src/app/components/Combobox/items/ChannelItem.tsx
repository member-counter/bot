import { useParams } from "next/navigation";
import { CheckIcon, XIcon } from "lucide-react";

import type { ComboboxProps } from "..";
import type { DashboardGuildParams } from "~/app/dashboard/servers/[guildId]/layout";
import { useChannelIcon } from "~/app/dashboard/servers/[guildId]/ChannelMaps";
import { mentionColor } from "~/other/mentionColor";
import { api } from "~/trpc/react";
import { TinyIconButton } from "../TinyIconButton";

const useChannelId = (id: string) => {
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  return guild.data?.channels.get(id);
};

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const ChannelItem = ({ item, isSelected, onRemove }: Props) => {
  const channel = useChannelId(item);

  const color = mentionColor(0xffffff);
  const Icon = useChannelIcon(item);
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
          <Icon className="mr-2 inline-block h-4 w-4" />
          {channel?.name ?? "Unknown channel"}
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
