import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DataSourceErrorTypes } from "@mc/common/DataSourceService/DataSourceEvaluator/DataSourceError";
import { Card } from "@mc/ui/card";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildChannelParams } from "../layout";
import { api } from "~/trpc/react";

export function TemplateError() {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const { t } = useTranslation();
  const channelLog = api.guild.channels.logs.get.useQuery({
    discordChannelId: channelId,
    discordGuildId: guildId,
  });

  if (!channelLog.data?.LastTemplateComputeError) return null;

  let translationKey: (typeof DataSourceErrorTypes)[number] = "UNKNOWN";

  const parsedError = z
    .enum(DataSourceErrorTypes)
    .safeParse(channelLog.data.LastTemplateComputeError);

  if (parsedError.success) {
    translationKey = parsedError.data;
  }

  // TODO also display error from preview

  return (
    <>
      <Separator />
      <div className="flex flex-col gap-3">
        <Label>
          {t(
            "pages.dashboard.servers.channels.sections.TemplateError.errorTitle",
          )}
        </Label>
        <Card className="border border-destructive p-3">
          <pre className="w-full whitespace-pre-wrap">
            {t(
              `pages.dashboard.servers.channels.sections.TemplateError.errors.${translationKey}`,
            )}
          </pre>
        </Card>
      </div>
    </>
  );
}
