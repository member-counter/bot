"use client";

import { api } from "~/trpc/react";
import { BlockedBanner } from "./BlockedBanner";
import { InviteBotBanner } from "./InviteBotBanner";
import { InvitePage } from "./InvitePage";

export interface DashboardGuildPageProps {
  children: React.ReactNode;
  params: { guildId: string };
}

export default function Layout({
  children,
  params: { guildId },
}: DashboardGuildPageProps) {
  const has = api.guild.has.useQuery({
    discordGuildId: guildId,
  });

  if (!has.isSuccess) return;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {has.data ? (
        <>
          <BlockedBanner guildId={guildId} />
          <InviteBotBanner guildId={guildId} />
          <div className="flex grow flex-row overflow-auto">{children}</div>
        </>
      ) : (
        <InvitePage guildId={guildId} />
      )}
    </div>
  );
}
