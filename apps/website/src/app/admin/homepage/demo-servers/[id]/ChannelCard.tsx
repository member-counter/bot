import type { DemoServerData } from "@mc/services/demoServers";
import { ChannelType } from "discord-api-types/v10";
import { TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Card } from "@mc/ui/card";
import { Checkbox } from "@mc/ui/checkbox";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

import { ChannelIconMap } from "~/app/dashboard/servers/[guildId]/ChannelMaps";

interface ChannelCardProps {
  channel: DemoServerData["channels"][number];
  index: number;
  updateChannel: (
    index: number,
    channel: DemoServerData["channels"][number],
  ) => void;
  removeChannel: (index: number) => void;
}

export function ChannelCard({
  channel,
  index,
  updateChannel,
  removeChannel,
}: ChannelCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col gap-4 bg-secondary p-4">
      <Label>
        {t("pages.admin.homePage.demoServers.manage.channels.channel.type")}
        <Select
          value={channel.type.toString()}
          onValueChange={(value) =>
            updateChannel(index, { ...channel, type: Number(value) })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={ChannelType.GuildAnnouncement.toString()}
                label={t(
                  "pages.admin.homePage.demoServers.manage.channels.channel.types.announcementChannel",
                )}
                icon={ChannelIconMap[ChannelType.GuildAnnouncement]}
              />
              <SelectItemWithIcon
                value={ChannelType.GuildText.toString()}
                label={t(
                  "pages.admin.homePage.demoServers.manage.channels.channel.types.textChannel",
                )}
                icon={ChannelIconMap[ChannelType.GuildText]}
              />

              <SelectItemWithIcon
                value={ChannelType.GuildVoice.toString()}
                label={t(
                  "pages.admin.homePage.demoServers.manage.channels.channel.types.voiceChannel",
                )}
                icon={ChannelIconMap[ChannelType.GuildVoice]}
              />

              <SelectItemWithIcon
                value={ChannelType.GuildCategory.toString()}
                label={t(
                  "pages.admin.homePage.demoServers.manage.channels.channel.types.categoryChannel",
                )}
                icon={ChannelIconMap[ChannelType.GuildCategory]}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.channels.channel.name")}
        <Input
          value={channel.name}
          onChange={(e) =>
            updateChannel(index, { ...channel, name: e.target.value })
          }
        />
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.channels.channel.topic")}
        {[ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(
          channel.type,
        ) && (
          <Input
            value={channel.topic ?? ""}
            onChange={(e) =>
              updateChannel(index, { ...channel, topic: e.target.value })
            }
          />
        )}
      </Label>
      <Checkbox
        checked={channel.showAsSkeleton}
        onCheckedChange={(state) => {
          updateChannel(index, {
            ...channel,
            showAsSkeleton: Boolean(state),
          });
        }}
      >
        {t(
          "pages.admin.homePage.demoServers.manage.channels.channel.showAsSkeleton",
        )}
      </Checkbox>
      <Button
        icon={TrashIcon}
        variant="destructive"
        type="button"
        onClick={() => removeChannel(index)}
      >
        {t("pages.admin.homePage.demoServers.manage.channels.channel.remove")}
      </Button>
    </Card>
  );
}
