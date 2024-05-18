"use client";

import { useContext } from "react";

import { api } from "~/trpc/react";
import { BlockedBanner } from "./BlockedBanner";
import { ForbiddenPage } from "./ForbiddenPage";
import { InviteBotBanner } from "./InviteBotBanner";
import { InviteBotPage } from "./InviteBotPage";
import { ManageServer } from "./ManageServer";
import {
  UserPermissionsContext,
  UserPermissionsContextProvider,
} from "./UserPermissionsContext";

export interface DashboardGuildParams {
  guildId: string;
  [key: string]: string | string[];
}

export interface DashboardGuildPageProps {
  children: React.ReactNode;
  params: DashboardGuildParams;
}

export default function Layout({
  children,
  params: { guildId },
}: DashboardGuildPageProps) {
  const userPermissions = useContext(UserPermissionsContext);

  const has = api.guild.has.useQuery({
    discordGuildId: guildId,
  });

  if (!has.isSuccess) return;

  return (
    <UserPermissionsContextProvider>
      <div className="flex h-full flex-col overflow-hidden">
        {has.data ? (
          <>
            <BlockedBanner />
            <InviteBotBanner />
            <div className="flex grow flex-row overflow-auto">
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
    </UserPermissionsContextProvider>
  );
}
