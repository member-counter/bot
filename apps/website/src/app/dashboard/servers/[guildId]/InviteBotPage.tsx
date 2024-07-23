import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@mc/ui/button";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import type { DashboardGuildParams } from "./layout";
import { BotIcon } from "~/app/components/BotIcon";
import { DiscordIcon } from "~/app/components/DiscordIcon";
import { useTranslation } from "~/i18n/client";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { MenuButton } from "../../Menu";
import { UserPermissionsContext } from "./UserPermissionsContext";

export function InviteBotPage() {
  const { guildId } = useParams<DashboardGuildParams>();
  const [clipboardFailed, setClipboardFailed] = useState(
    !window.isSecureContext,
  );
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopySuccess(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [copySuccess]);

  const [t] = useTranslation();

  const inviteLink = Routes.Invite(guildId);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(inviteLink, window.location.origin).toString(),
      );
      setCopySuccess(true);
    } catch {
      setClipboardFailed(true);
    }
  };

  const userPermissions = useContext(UserPermissionsContext);
  const userGuildsQuery = api.discord.userGuilds.useQuery(undefined, {
    initialData: () => ({ userGuilds: new Map() }),
  });
  const guild = userGuildsQuery.data.userGuilds.get(guildId);

  return (
    <div className="flex h-full flex-col p-1">
      <MenuButton />
      <div className="m-auto flex max-w-full flex-col gap-5 p-3 text-left sm:text-center">
        <BotIcon className="mx-auto h-32 w-32 sm:hidden" />
        <h1 className="sm:text-4x2 text-3xl">
          {t("pages.dashboard.servers.inviteBotPage.title")}
          <BotIcon className="ml-1 mt-[-5px] hidden h-16 w-11 sm:inline-block" />
        </h1>
        <h2>
          {t("pages.dashboard.servers.inviteBotPage.subtitle", {
            serverName: guild?.name ?? t("common.unknownServer"),
          })}
        </h2>
        {userPermissions.canInviteBot ? (
          <Link href={inviteLink} target="_blank" className="block">
            <Button className="h-auto w-full text-wrap py-3" icon={DiscordIcon}>
              {t("pages.dashboard.servers.inviteBotPage.addToServer", {
                serverName: guild?.name ?? t("common.unknownServer"),
              })}
            </Button>
          </Link>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              {t("pages.dashboard.servers.inviteBotPage.noPermission")}
            </div>
            {clipboardFailed ? (
              <LinkUnderlined href={inviteLink} target="_blank">
                {t("pages.dashboard.servers.inviteBotPage.useOrShareLink")}
              </LinkUnderlined>
            ) : (
              <Button
                className="h-auto w-full text-wrap py-3"
                icon={copySuccess ? CheckIcon : CopyIcon}
                onClick={copyLink}
                disabled={copySuccess}
              >
                {copySuccess
                  ? t("pages.dashboard.servers.inviteBotPage.linkCopied")
                  : t("pages.dashboard.servers.inviteBotPage.copyLink")}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
