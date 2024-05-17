"use client";

import { api } from "~/trpc/react";

export interface DashboardGuildPageProps {
  children: React.ReactNode;
  params: { guildId: string };
}

export default function Layout({ children, params }: DashboardGuildPageProps) {
  const guild = api.discord.getGuild.useQuery({ id: params.guildId });

  return (
    <div>
      <h1>Current selected server:</h1>
      {children}
    </div>
  );
}
