"use client";

import { useEffect } from "react";
import { useParams,   useRouter } from "next/navigation";
import { Trans } from "react-i18next"; 

import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react"; 
import { TypographyH3 } from "@mc/ui/TypographyH3";
import { TypographyH4 } from "@mc/ui/TypographyH4";

export default function Page() {
  const router = useRouter();
  const selected = useParams();
  const userGuildsQuery = api.discord.userGuilds.useQuery();

  const hasAnythingSelected = Object.keys(selected).length > 0;

  // Autoselect the first guild if no guild is selected yet.
  useEffect(() => {
    console.log(userGuildsQuery.data);

    if (!userGuildsQuery.data) return;
    if (!userGuildsQuery.data.userGuilds.size) return;
    if (hasAnythingSelected) return;

    const firstGuildId = [...userGuildsQuery.data.userGuilds.keys()][0];

    router.replace(Routes.DashboardServers(firstGuildId));
  }, [hasAnythingSelected, router, userGuildsQuery.data]);

  return (
    <div className="flex flex-col p-1 grow justify-center items-center  h-full "> 
      {!userGuildsQuery.isLoading && !userGuildsQuery.data?.userGuilds.size && (
        <>
          <TypographyH3>
            <Trans i18nKey="pages.dashboard.noServers.heading" />
          </TypographyH3>
          <TypographyH4>
            <Trans
              i18nKey="pages.dashboard.noServers.subheading"
              components={{
                CreateServerLink: (
                  <LinkUnderlined href={Routes.CreateDiscordServer} />
                ),
                JoinSupportServerLink: <LinkUnderlined href={Routes.Support} />,
              }}
            />
          </TypographyH4>
        </ >
      )}
    </div>
  );
}
