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
      <div className="flex flex-col gap-5 text-left sm:text-center">
        <BotIcon className="mx-auto h-32 w-32 sm:hidden" />
        <h1 className="sm:text-4x2 text-3xl">
          Let's setup the bot!
          <BotIcon className="ml-1 mt-[-5px] hidden h-16 w-11 sm:inline-block" />
        </h1>
        <h2>
          Add Member counter to {guild?.name ?? "Unknown server"} and enjoy
          realtime counters.
        </h2>
        {userPermissions.canInviteBot ? (
          <Link href={inviteLink} target="_blank" className="block">
            <Button className="w-full">
              <DiscordIcon className="mr-2 h-4 w-4" />
              Add to {guild?.name ?? "Unknown server"}
            </Button>
          </Link>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              You don't have enough permissions to add the bot.
              <br />
              Please ask an administrator or someone with Manage Server
              permission to add this bot.
            </div>
            {clipboardFailed ? (
              <LinkUnderlined href={inviteLink} target="_blank">
                Use or share this link to add the bot
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
  );
}
