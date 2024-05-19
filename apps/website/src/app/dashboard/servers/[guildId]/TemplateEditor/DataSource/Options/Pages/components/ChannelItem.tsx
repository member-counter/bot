import { useParams } from "next/navigation";
import { XIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import type { GuildChannel } from "../../../../d-types";
import type { DashboardGuildParams } from "~/app/dashboard/servers/[guildId]/layout";
import { api } from "~/trpc/react";

export const ChannelItem = ({
  onClick,
  onClickDelete,
  channel: unresolvedChannel,
  isSelected,
}: {
  onClick?: () => void;
  onClickDelete?: () => void;
  channel: GuildChannel | string;
  isSelected?: boolean;
}) => {
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channels = guild.data?.channels ?? new Map<string, GuildChannel>();

  const channel =
    typeof unresolvedChannel === "object"
      ? unresolvedChannel
      : channels.get(unresolvedChannel);

  return (
    <div
      className={cn([
        "flex h-[40px] flex-row items-center rounded-md border border-input bg-background pl-3 text-[#a3d8fe] hover:bg-accent hover:text-accent-foreground",
        {
          "bg-accent text-[#a3d8fe]": isSelected,
          "cursor-pointer": !!onClick,
        },
      ])}
      role={onClick ? "button" : undefined}
      onClick={onClick}
    >
      <div className="mr-auto text-sm">
        {channel ? "# " + channel.name : "Unknown channel"}
      </div>
      {onClickDelete && (
        <Button size="sm" variant="none" onClick={onClickDelete}>
          <XIcon className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
