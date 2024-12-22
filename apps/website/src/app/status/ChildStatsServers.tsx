import { cn } from "@mc/ui";

import { discordServerNameAbbreviated } from "~/other/discordServerNameAbbreviated";
import { InfoToolip } from "../components/InfoTooltip";

export function ChildStatsDiscordServers({
  className,
  assignedGuilds,
}: {
  className?: string;
  assignedGuilds: {
    id: string;
    name: string;
    icon: string | null;
  }[];
}) {
  return (
    <div
      className={cn(
        "mt-1 flex flex-wrap gap-1 rounded-sm border border-border p-1",
        className,
      )}
    >
      {assignedGuilds.map((server) => (
        <InfoToolip key={server.id} text={server.name}>
          {server.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={server.icon}
              className="h-6 w-6 rounded-full"
              alt={server.name}
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card"
            >
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                {discordServerNameAbbreviated(server.name)}
              </div>
            </div>
          )}
        </InfoToolip>
      ))}
    </div>
  );
}
