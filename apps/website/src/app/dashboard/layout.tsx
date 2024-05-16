"use client";

import type React from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@mc/ui";
import { Separator } from "@mc/ui/separator";

import { api } from "~/trpc/react";
import DSelector from "../components/DSelector";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ guildId: string }>();
  const userGuilds = api.discord.userGuilds.useQuery(undefined, {
    initialData: [],
  });

  const overflowClass = "mt-[-57px] pt-[57px] max-h-screen overflow-auto";

  return (
    <div className="flex grow flex-row">
      <DSelector
        className={cn(overflowClass, "mb-0 pb-3 pt-[68px]")}
        itemClassName="bg-card hover:bg-primary"
        pre={[]}
        guilds={userGuilds.data.map((guild) => ({
          ...guild,
          run: () => {
            router.push("/dashboard/servers/" + guild.id);
          },
          isSelected: params.guildId === guild.id,
        }))}
      />
      <Separator
        orientation="vertical"
        className={cn(
          "h-auto w-0 border-r border-border/90 bg-inherit",
          overflowClass,
        )}
      />
      <div className={cn(overflowClass, "grow")}>{children}</div>
    </div>
  );
}
