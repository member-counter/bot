"use client";

import { useContext } from "react";
import { useParams } from "next/navigation";

import type { DashboardGuildParams } from "./layout";
import { api } from "~/trpc/react";
import { BlockedBanner } from "./BlockedBanner";
import { ForbiddenPage } from "./ForbiddenPage";
import { InviteBotBanner } from "./InviteBotBanner";
import { InviteBotPage } from "./InviteBotPage";
import { LoadingPage } from "./LoadingPage";
import { ManageServerLayout } from "./ManageServerLayout";
import { UserPermissionsContext } from "./UserPermissionsContext";

export default function LayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { guildId } = useParams<DashboardGuildParams>();
  const userPermissions = useContext(UserPermissionsContext);

  const has = api.guild.has.useQuery({
    discordGuildId: guildId,
  });

  return (
    <div className="flex h-full max-h-full flex-col overflow-hidden rounded">
      <BlockedBanner />
      <InviteBotBanner />
      <div className="grow overflow-hidden">
        {!has.isSuccess || !userPermissions.fetched ? (
          <LoadingPage />
        ) : has.data ? (
          userPermissions.canRead ? (
            <ManageServerLayout>{children}</ManageServerLayout>
          ) : (
            <ForbiddenPage />
          )
        ) : (
          <InviteBotPage />
        )}
      </div>
    </div>
  );
}
