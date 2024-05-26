import { useId } from "react";
import { useParams } from "next/navigation";

import { Label } from "@mc/ui/label";

import type { DashboardGuildChannelParams } from "../layout";
import formatRelativeTime from "~/other/formatRelativeTime";
import { api } from "~/trpc/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function EditTemplate({ value, onChange, disabled }: Props) {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const templateInput = useId();
  const channelLog = api.guild.channels.getLogs.useQuery({
    discordChannelId: channelId,
    discordGuildId: guildId,
  });

  const lastTemplateComputeDate = channelLog.data?.lastTemplateComputeDate
    ? formatRelativeTime("en-US", channelLog.data.lastTemplateComputeDate)
    : "Unknown";

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <Label htmlFor={templateInput}>Template</Label>
        <span className="text-xs leading-none text-muted-foreground">
          Last update: {lastTemplateComputeDate}
        </span>
      </div>
    </div>
  );
}
