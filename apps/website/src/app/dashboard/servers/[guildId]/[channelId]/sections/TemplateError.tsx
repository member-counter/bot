import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildChannelParams } from "../layout";
import { api } from "~/trpc/react";
import { DisplayTemplateError } from "../../TemplateEditor/DisplayTemplateError";

export function TemplateError() {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const { t } = useTranslation();
  const channelLog = api.guild.channels.logs.get.useQuery({
    discordChannelId: channelId,
    discordGuildId: guildId,
  });

  if (!channelLog.data?.LastTemplateComputeError) return null;

  return (
    <>
      <Separator />
      <div className="flex flex-col gap-3">
        <Label>
          {t(
            "pages.dashboard.servers.channels.sections.TemplateError.errorTitle",
          )}
        </Label>
        <DisplayTemplateError
          message={channelLog.data.LastTemplateComputeError}
        />
      </div>
    </>
  );
}
