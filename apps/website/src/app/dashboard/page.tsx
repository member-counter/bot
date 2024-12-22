"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { Trans } from "react-i18next";

import { LinkUnderlined } from "@mc/ui/LinkUnderlined";
import { TypographyH3 } from "@mc/ui/TypographyH3";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const selected = useParams();
  const userGuildsQuery = api.discord.userGuilds.useQuery();

  const hasAnythingSelected = Object.keys(selected).length > 0;

  // Autoselect the first guild if no guild is selected yet.
  useEffect(() => {
    if (!userGuildsQuery.data) return;
    if (!userGuildsQuery.data.userGuilds.size) return;
    if (hasAnythingSelected) return;

    const firstGuildId = [...userGuildsQuery.data.userGuilds.keys()][0];

    router.replace(Routes.DashboardServers(firstGuildId));
  }, [hasAnythingSelected, router, userGuildsQuery.data]);

  return (
    <div className="flex h-full grow flex-col items-center justify-center  p-1 ">
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
        </>
      )}
    </div>
  );
}
