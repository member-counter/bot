"use client";

import { useContext } from "react";
import { useParams } from "next/navigation";

import type { DashboardGuildParams } from "./layout";
import { api } from "~/trpc/react";
import { BlockedBanner } from "./BlockedBanner";
import { ForbiddenPage } from "./ForbiddenPage";
import { InviteBotBanner } from "./InviteBotBanner";
import { InviteBotPage } from "./InviteBotPage";
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

  if (!has.isSuccess) return;

  return (
    <>
      <div className="flex h-full max-h-full flex-col">
        <BlockedBanner />
        <InviteBotBanner />
        {has.data ? (
          <div className="max-h-full grow overflow-hidden">
            <div className="h-full">
              {userPermissions.canRead ? (
                <ManageServerLayout>{children}</ManageServerLayout>
              ) : (
                <ForbiddenPage />
              )}
            </div>
          </div>
        ) : (
          <InviteBotPage />
        )}
      </div>
    </>
  );
}
