import { useParams } from "next/navigation";
import { XIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import type { GuildRole } from "../../../../d-types";
import type { DashboardGuildParams } from "~/app/dashboard/servers/[guildId]/layout";
import { mentionColor } from "~/other/mentionColor";
import { api } from "~/trpc/react";

export const RoleItem = ({
  onClick,
  onClickDelete,
  role: unresolvedRole,
  isSelected,
}: {
  onClick?: () => void;
  onClickDelete?: () => void;
  role: GuildRole | string;
  isSelected?: boolean;
}) => {
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const roles = guild.data?.roles ?? new Map<string, GuildRole>();

  const role =
    typeof unresolvedRole === "object"
      ? unresolvedRole
      : roles.get(unresolvedRole);
  const color = mentionColor(role?.color ?? parseInt("ffffff", 16));

  return (
    <div
      className={cn([
        "flex h-[40px] flex-row items-center rounded-md border border-input bg-background pl-3 hover:bg-accent hover:text-accent-foreground",
        {
          "bg-accent text-accent-foreground": isSelected,
          "cursor-pointer": !!onClick,
        },
      ])}
      role={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        color: color.text,
      }}
    >
      <div className="mr-auto text-sm">
        {role ? "@ " + role.name : "Unknown role"}
      </div>
      {onClickDelete && (
        <Button size="sm" variant="none" onClick={onClickDelete}>
          <XIcon className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
