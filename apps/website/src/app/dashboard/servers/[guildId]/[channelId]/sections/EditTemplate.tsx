import { useId } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";

import { Label } from "@mc/ui/label";

import type { DashboardGuildChannelParams } from "../layout";
import formatRelativeTime from "~/other/formatRelativeTime";
import { api } from "~/trpc/react";
import TemplateEditorLayout from "../../TemplateEditor/TemplateEditorLayout";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function EditTemplate({ value, onChange, disabled }: Props) {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const channelQuery = api.guild.channels.get.useQuery({
    discordGuildId: guildId,
    discordChannelId: channelId,
  });
  const [guild] = api.discord.getGuild.useSuspenseQuery({ id: guildId });
  const channelType =
    guild.channels.get(channelId)?.type ?? ChannelType.GuildText;
  const templateInput = useId();
  const channelLog = api.guild.channels.getLogs.useQuery({
    discordChannelId: channelId,
    discordGuildId: guildId,
  });

  const channelIsTextLike = [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
  ].includes(channelType);

  const lastTemplateComputeDate = channelLog.data?.lastTemplateComputeDate
    ? formatRelativeTime("en-US", channelLog.data.lastTemplateComputeDate)
    : "Unknown";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <Label htmlFor={templateInput}>Template</Label>
        <span className="text-xs leading-none text-muted-foreground">
          Last update: {lastTemplateComputeDate}
        </span>
      </div>
      <TemplateEditorLayout
        id={templateInput}
        initiate={channelQuery.isSuccess}
        initialValue={value}
        onChange={onChange}
        disabled={disabled}
        target={channelIsTextLike ? "channelTopic" : "channelName"}
      />
    </div>
  );
}
