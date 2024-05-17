import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon, CopyIcon } from "lucide-react";

import { BitField } from "@mc/common/BitField";
import { DiscordPermissions } from "@mc/common/DiscordPermissions";
import { Button } from "@mc/ui/button";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { BotIcon } from "~/app/components/BotIcon";
import { DiscordIcon } from "~/app/components/DiscordIcon";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

interface Props {
  guildId: string;
}

export function InvitePage({ guildId }: Props) {
  const [clipboardFailed, setClipboardFailed] = useState(
    !window.isSecureContext,
  );
  const [copySuccess, setCopySuccess] = useState(false);
  const userGuilds = api.discord.userGuilds.useQuery();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [copySuccess]);

  if (!userGuilds.isSuccess) return;

  const guild = userGuilds.data.find((g) => g.id === guildId);

  const userPermissionsInGuild = new BitField(guild?.permissions);

  const userCanInviteTheBot = userPermissionsInGuild.has(
    DiscordPermissions.Administrator | DiscordPermissions.ManageGuild,
  );

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
          {userCanInviteTheBot ? (
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
                permission to add the bot.
              </div>
              {clipboardFailed ? (
                <LinkUnderlined href={inviteLink} target="_blank">
                  Use this link to add the bot
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
