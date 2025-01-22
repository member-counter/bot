import { useId } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const enableTemplateSwitch = useId();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);

  const isTemplateForName =
    channel?.type === ChannelType.GuildVoice ||
    channel?.type === ChannelType.GuildCategory;
  const templateTarget = isTemplateForName
    ? t("pages.dashboard.servers.channels.sections.EnableTemplate.nameTarget")
    : t("pages.dashboard.servers.channels.sections.EnableTemplate.topicTarget");

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-col gap-3">
        <Label htmlFor={enableTemplateSwitch}>
          {t(
            "pages.dashboard.servers.channels.sections.EnableTemplate.enableTemplate",
          )}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t(
            "pages.dashboard.servers.channels.sections.EnableTemplate.description",
            { templateTarget },
          )}
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
