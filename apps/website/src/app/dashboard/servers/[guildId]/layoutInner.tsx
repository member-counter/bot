"use client";

import { useContext } from "react";
import { useParams } from "next/navigation";

import type { DashboardGuildParams } from "./layout";
import { api } from "~/trpc/react";
import { BlockedBanner } from "./BlockedBanner";
import { ForbiddenPage } from "./ForbiddenPage";
import { InviteBotBanner } from "./InviteBotBanner";
import { InviteBotPage } from "./InviteBotPage";
import { ManageServer } from "./ManageServer";
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
    <div className="flex h-full max-h-full">
      {has.data ? (
        <>
          <BlockedBanner />
          <InviteBotBanner />
          <div className="grow">
            {userPermissions.canRead ? (
              <ManageServer>{children}</ManageServer>
            ) : (
              <ForbiddenPage />
            )}
          </div>
        </>
      ) : (
        <InviteBotPage />
      )}
    </div>
  );
}
