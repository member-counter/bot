"use client";

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
      <LayoutInner>{children}</LayoutInner>
    </UserPermissionsContextProvider>
  );
}
