"use client";

import type { DiscordUserGuild } from "@mc/validators/DiscordUserGuilds";
import type React from "react";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@mc/ui";

import type { DashboardGuildParams } from "./servers/[guildId]/layout";
import { pageTitle } from "~/other/pageTitle";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import DSelector from "../components/DSelector";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<DashboardGuildParams>();
  const {
    data: { userGuilds },
  } = api.discord.userGuilds.useQuery(undefined, {
    initialData: { userGuilds: new Map<string, DiscordUserGuild>() },
  });

  useEffect(() => {
    userGuilds.forEach((guild) =>
      router.prefetch(Routes.DashboardServers(guild.id)),
    );

    if (!params.guildId) return;

    const selectedGuild = userGuilds.get(params.guildId);

    document.title = pageTitle(selectedGuild?.name ?? "Unknown server");
  }, [params.guildId, userGuilds, router]);

  // margin-top/padding-top to leave space for the nav bar but keeping the actual box under it
  const overflowClass = "mt-[-57px] pt-[57px] max-h-screen overflow-auto";

  return (
    <div className="flex grow flex-row bg-black ">
      <DSelector
        className={cn(overflowClass, "mb-0 bg-black pb-3 pt-[68px]")}
        classNameForItem={"bg-card hover:bg-primary"}
        pre={[]}
        guilds={[...userGuilds.values()].map((guild) => ({
          ...guild,
          onClick: () => {
            router.push(Routes.DashboardServers(guild.id));
          },
          isSelected: params.guildId === guild.id,
        }))}
      />
      <div
        className={cn(
          overflowClass,
          "flex grow flex-col bg-black pb-[10px] pr-[10px] pt-[67px]",
        )}
      >
        <div className="h-full max-h-full rounded border border-border bg-card">
          {children}
        </div>
      </div>
    </div>
  );
}
