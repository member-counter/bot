import { useEffect } from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";
import { TypographyH3 } from "@mc/ui/TypographyH3";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { api } from "~/lib/trpc";

export default function Page() {
  const navigate = useNavigate();
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  const userGuildsQuery = api.discord.userGuilds.useQuery();

  // Autoselect the first guild if no guild is selected yet.
  useEffect(() => {
    if (!userGuildsQuery.data) return;
    if (!userGuildsQuery.data.userGuilds.size) return;
    if (guildId) return;

    const firstGuildId = [...userGuildsQuery.data.userGuilds.keys()][0];

    if (!firstGuildId) return;

    void navigate(
      routes.dashboard.servers.server.$buildPath({
        params: { guildId: firstGuildId },
      }),
    );
  }, [guildId, navigate, userGuildsQuery.data]);

  return (
    <div className="flex h-full grow flex-col items-center justify-center p-1">
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
                  <LinkUnderlined
                    to={`https://discord.com/channels/@me`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  />
                ),
                JoinSupportServerLink: (
                  <LinkUnderlined
                    to={routes.support.$buildPath({})}
                    target="_blank"
                  />
                ),
              }}
            />
          </TypographyH4>
        </>
      )}
    </div>
  );
}
