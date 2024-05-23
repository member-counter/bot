"use client";

import { useState } from "react";
import { ShieldBanIcon, ShieldCheck } from "lucide-react";

import { Button } from "@mc/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mc/ui/dialog";
import { Input } from "@mc/ui/input";

import { api } from "~/trpc/react";

export function BlockButton({
  guildId,
  disabled,
  className,
}: {
  className?: string;
  guildId: string;
  disabled?: boolean;
}) {
  const [reason, setReason] = useState("");
  const updateBlockStateMutation = api.guild.updateBlockState.useMutation();
  const blockedState = api.guild.isBlocked.useQuery({
    discordGuildId: guildId,
  });

  const updateBlockState = async (isBlocked: boolean) => {
    await updateBlockStateMutation.mutateAsync({
      discordGuildId: guildId,
      state: isBlocked,
      reason,
    });
    await blockedState.refetch();
  };

  if (blockedState.data) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"destructive"}
            icon={ShieldCheck}
            disabled={disabled}
            className={className}
          >
            Unblock server
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Do you really want to unblock this server?
            </DialogTitle>
            <DialogDescription>
              This server was blocked due to the following reason:{" "}
              {blockedState.data.reason}
            </DialogDescription>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button
                  icon={ShieldCheck}
                  variant="destructive"
                  onClick={() => updateBlockState(false)}
                >
                  Unblock server
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          icon={ShieldBanIcon}
          disabled={disabled}
          className={className}
        >
          Block server
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you really want to block this server?</DialogTitle>
          <DialogDescription className="space-y-2 pt-1">
            <p>
              The given reason will be displayed to the server administrators.
            </p>
            <Input
              aria-label="Reason"
              placeholder="Please specify a reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </DialogDescription>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button
                icon={ShieldBanIcon}
                variant="destructive"
                onClick={() => updateBlockState(true)}
              >
                Block server
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
