import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import { api } from "~/lib/trpc";
import { DisplayTemplateError } from "../../TemplateEditor/DisplayTemplateError";
import invariant from "tiny-invariant";

export function TemplateError() {
  const { guildId, channelId } = useTypedParams(
    routes.dashboard.servers.server.channel,
  );
  invariant(channelId, "Expected channelId to be defined");
  invariant(guildId, "Expected guildId to be defined");

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
