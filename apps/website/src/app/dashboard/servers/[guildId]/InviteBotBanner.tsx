import { useEffect, useState } from "react";
import { BotIcon, XIcon } from "lucide-react";
import { Trans } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";

import { LinkUnderlined } from "~/app/components/LinkUnderlined";
import { api } from "~/lib/trpc";

export function InviteBotBanner() {
  const [closed, setClosed] = useState(false);
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const authenticatedUser = api.session.user.useQuery();
  const has = api.guild.has.useQuery({
    discordGuildId: guildId,
  });

  const discordGuild = api.discord.getGuild.useQuery(
    { id: guildId },
    { enabled: !authenticatedUser.data },
  );

  useEffect(() => {
    setClosed(false);
  }, [discordGuild.data]);

  if (discordGuild.isPending || discordGuild.data) return;
  if (closed) return;
  if (!has.data) return;

  return (
    <div className="flex w-full flex-row bg-primary p-1 text-xs font-bold">
      <div className="flex items-center pl-1 pr-2">
        <BotIcon className="h-5 w-5" />
      </div>
      <div className="flex items-center">
        <p className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]">
          <Trans
            i18nKey="pages.dashboard.servers.inviteBotBanner.message"
            components={{
              LinkURL: (
                <LinkUnderlined
                  to={routes.invite.$buildPath({ params: { guildId } })}
                  target="_blank"
                />
              ),
            }}
          />
        </p>
      </div>
      <div className="flex grow items-center">
        <Button
          className="ml-auto"
          size={"icon"}
          variant={"none"}
          onClick={() => setClosed(true)}
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
}
