import { useId } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";

import { Label } from "@mc/ui/label";
import { Switch } from "@mc/ui/switch";

import type { DashboardGuildChannelParams } from "../layout";
import { api } from "~/trpc/react";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

export function EnableTemplate({ value, onChange, disabled }: Props) {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const enableTemplateSwitch = useId();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);

  const isTemplateForName =
    channel?.type === ChannelType.GuildVoice ||
    channel?.type === ChannelType.GuildCategory;
  const templateTarget = isTemplateForName ? "name" : "topic";

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <Label htmlFor={enableTemplateSwitch}>Enable template</Label>
        <p className="text-sm text-muted-foreground">
          When enabled, Member Counter will automatically update this channel's{" "}
          {templateTarget} to show the proccessed template.
        </p>
      </div>
      <Switch
        id={enableTemplateSwitch}
        disabled={disabled}
        checked={value}
        onCheckedChange={(checked) => onChange(!!checked)}
      />
    </div>
  );
}
