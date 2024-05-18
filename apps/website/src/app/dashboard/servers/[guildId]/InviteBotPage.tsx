import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@mc/ui/button";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import type { DashboardGuildParams } from "./layout";
import { BotIcon } from "~/app/components/BotIcon";
import { DiscordIcon } from "~/app/components/DiscordIcon";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
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
  const userGuilds = api.discord.userGuilds.useQuery();
  const guild = userGuilds.data?.get(guildId);

  return (
    <div className="flex grow items-center justify-center p-4">
      <div className="text-left sm:text-center">
        <h1 className="text-4xl">
          Let's setup the bot!
          <BotIcon className="ml-1 mt-[-5px] inline-block h-16 w-11" />
        </h1>
        <h2>
          Add Member counter to {guild?.name ?? "Unknown server"} and enjoy
          realtime counters.
        </h2>
        <div className="mt-5">
          {userPermissions.canInviteBot ? (
            <Link href={inviteLink} target="_blank">
              <Button className="w-full">
                <DiscordIcon className="mr-2 h-4 w-4" />
                Add to {guild?.name ?? "Unknown server"}
              </Button>
            </Link>
          ) : (
            <>
              <div className="mb-5 text-sm text-muted-foreground">
                You don't have enough permissions to add the bot.
                <br />
                Please ask an administrator or someone with Manage Server
                permission to add this bot.
              </div>
              {clipboardFailed ? (
                <LinkUnderlined href={inviteLink} target="_blank">
                  Use this link to add this bot
                </LinkUnderlined>
              ) : (
                <Button
                  className="w-full"
                  onClick={copyLink}
                  disabled={copySuccess}
                >
                  {copySuccess ? (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      The link has been copied to your clipboard
                    </>
                  ) : (
                    <>
                      <CopyIcon className="mr-2 h-4 w-4" />
                      Copy invite link
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
