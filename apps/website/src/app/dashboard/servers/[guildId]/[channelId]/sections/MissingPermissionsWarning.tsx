import { useState } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";
import { CircleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@mc/ui";
import { Alert, AlertDescription, AlertTitle } from "@mc/ui/alert";
import { Button } from "@mc/ui/button";

import type { DashboardGuildChannelParams } from "../layout";
import { api } from "~/trpc/react";

export default function MissingPermissionsWarning() {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);
  const { t } = useTranslation();

  const [shake, setShake] = useState(false);

  const botHasPermissionsToEdit = api.bot.canBotEditChannel.useQuery({
    guildId,
    channelId,
  });

  if (!channel) {
    return null;
  }

  if (
    botHasPermissionsToEdit.data === undefined ||
    botHasPermissionsToEdit.data
  ) {
    return null;
  }

  const necessaryPermissions: string[] = [
    t(
      "pages.dashboard.servers.channels.sections.MissingPermissionsWarning.permissions.viewChannel",
    ),
    t(
      "pages.dashboard.servers.channels.sections.MissingPermissionsWarning.permissions.manageChannel",
    ),
  ];

  if (channel.type === ChannelType.GuildVoice) {
    necessaryPermissions.push(
      t(
        "pages.dashboard.servers.channels.sections.MissingPermissionsWarning.permissions.connect",
      ),
    );
  }

  return (
    <Alert variant="destructive" className={cn(shake && "animate-shake-once")}>
      <CircleAlertIcon className="mr-42" />
      <AlertTitle>
        {t(
          "pages.dashboard.servers.channels.sections.MissingPermissionsWarning.title",
        )}
      </AlertTitle>
      <AlertDescription>
        <p>
          {t(
            "pages.dashboard.servers.channels.sections.MissingPermissionsWarning.description",
          )}
        </p>
        <ul className="list-inside list-disc text-sm">
          {necessaryPermissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
        <div className="mt-2 flex justify-end">
          <Button
            variant="outline"
            disabled={botHasPermissionsToEdit.isFetching}
            onClick={() => {
              setShake(false);
              void botHasPermissionsToEdit.refetch().then((res) => {
                setShake(!res.data);
              });
            }}
          >
            {t(
              "pages.dashboard.servers.channels.sections.MissingPermissionsWarning.checkAgainBtn",
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
