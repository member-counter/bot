import { useParams } from "next/navigation";

import { Card } from "@mc/ui/card";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildChannelParams } from "../layout";
import { api } from "~/trpc/react";

export function TemplateError() {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const channelLog = api.guild.channels.logs.get.useQuery({
    discordChannelId: channelId,
    discordGuildId: guildId,
  });

  if (!channelLog.data?.lastTemplateComputeError) return;

  return (
    <>
      <Separator />
      <div className="flex flex-col gap-3">
        <Label>The template had an error when was last processed</Label>
        <Card className="border border-destructive p-3">
          <pre className="w-full whitespace-pre-wrap">
            {channelLog.data.lastTemplateComputeError}
          </pre>
        </Card>
      </div>
    </>
  );
}
