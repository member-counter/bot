"use client";

import { BlockedBanner } from "./BlockedBanner";
import { InviteBotBanner } from "./InviteBotBanner";
import LayoutInner from "./layoutInner";
import { UserPermissionsContextProvider } from "./UserPermissionsContext";

export interface DashboardGuildParams {
  guildId: string;
  [key: string]: string | string[];
}

export interface DashboardGuildPageProps {
  children: React.ReactNode;
  params: DashboardGuildParams;
}

export default function Layout({ children }: DashboardGuildPageProps) {
  return (
    <UserPermissionsContextProvider>
      <div className="flex h-full max-h-full flex-col overflow-hidden rounded">
        <BlockedBanner />
        <InviteBotBanner />
        <div className="grow overflow-hidden">
          <LayoutInner>{children}</LayoutInner>
        </div>
      </div>
    </UserPermissionsContextProvider>
  );
}
