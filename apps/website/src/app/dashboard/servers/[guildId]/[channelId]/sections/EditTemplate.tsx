import { useId } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";
import { useTranslation } from "react-i18next";

import { Label } from "@mc/ui/label";

import formatRelativeTime from "~/other/formatRelativeTime";
import { api } from "~/trpc/react";
import TemplateEditor from "../../TemplateEditor/TemplateEditor";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function EditTemplate({ value, onChange, disabled }: Props) {
  const { guildId, channelId } = useParams<{
    guildId: string;
    channelId: string;
  }>();
  const { t } = useTranslation();
  const channelQuery = api.guild.channels.get.useQuery({
    discordGuildId: guildId,
    discordChannelId: channelId,
  });
  const [guild] = api.discord.getGuild.useSuspenseQuery({ id: guildId });
  const channelType =
    guild.channels.get(channelId)?.type ?? ChannelType.GuildText;
  const templateInput = useId();
  const channelLog = api.guild.channels.logs.get.useQuery({
    discordChannelId: channelId,
    discordGuildId: guildId,
  });

  const channelIsTextLike = [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
  ].includes(channelType);

  const lastTemplateUpdateDate = channelLog.data?.LastTemplateUpdateDate
    ? formatRelativeTime("en-US", channelLog.data.LastTemplateUpdateDate)
    : t("common.unknownDate");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <Label htmlFor={templateInput}>
          {t("pages.dashboard.servers.channels.sections.EditTemplate.template")}
        </Label>
        <span className="text-xs leading-none text-muted-foreground">
          {t(
            "pages.dashboard.servers.channels.sections.EditTemplate.lastUpdated",
            {
              lastTemplateUpdateDate,
            },
          )}
        </span>
      </div>
      <TemplateEditor
        id={templateInput}
        initiate={channelQuery.isSuccess}
        value={value}
        onChange={onChange}
        disabled={disabled}
        target={channelIsTextLike ? "channelTopic" : "channelName"}
      />
    </div>
  );
}
