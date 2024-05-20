"use client";

import type React from "react";
import { createContext, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@mc/ui";

import type { DashboardGuildParams } from "./servers/[guildId]/layout";
import { pageTitle } from "~/other/pageTitle";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import DSelector from "../components/DSelector";

export const MenuContext = createContext<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => void 0,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<DashboardGuildParams>();
  const userGuildsQuery = api.discord.userGuilds.useQuery();

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const menuContextValue = useMemo(
    () => ({
      isOpen: isMenuOpen,
      setIsOpen: setIsMenuOpen,
    }),
    [isMenuOpen],
  );

  useEffect(() => {
    userGuildsQuery.data?.userGuilds.forEach((guild) =>
      router.prefetch(Routes.DashboardServers(guild.id)),
    );

    if (!params.guildId) return;

    const selectedGuild = userGuildsQuery.data?.userGuilds.get(params.guildId);

    document.title = pageTitle(selectedGuild?.name ?? "Unknown server");
  }, [params.guildId, userGuildsQuery, router]);

  // margin-top/padding-top to leave space for the nav bar but keeping the actual box under it
  const overflowClass = "mt-[-57px] pt-[57px] max-h-screen overflow-auto";

  return (
    <MenuContext.Provider value={menuContextValue}>
      <div className="flex grow flex-row bg-black ">
        <DSelector
          isPending={!userGuildsQuery.data}
          className={cn(
            overflowClass,
            "mb-0 bg-black pb-3 pt-[68px] transition-all duration-100",
            {
              "ml-[-72px] mr-[8px] sm:ml-[0] sm:mr-[0]": !isMenuOpen,
            },
          )}
          classNameForItem={"bg-card hover:bg-primary"}
          pre={[]}
          guilds={[...(userGuildsQuery.data?.userGuilds.values() ?? [])].map(
            (guild) => ({
              ...guild,
              onClick: () => {
                router.push(Routes.DashboardServers(guild.id));
              },
              isSelected: params.guildId === guild.id,
            }),
          )}
        />
        <div
          className={cn(
            overflowClass,
            "flex grow flex-col bg-black pb-[10px] pr-[10px] pt-[67px]",
          )}
        >
          <div className="h-full max-h-full rounded border border-border bg-[#181514]">
            {children}
          </div>
        </div>
      </div>
    </MenuContext.Provider>
  );
}
