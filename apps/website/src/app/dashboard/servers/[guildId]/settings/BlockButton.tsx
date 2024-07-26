"use client";

import { useState } from "react";
import { ShieldBanIcon, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
            {t("pages.dashboard.servers.settings.block.unblockButton")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("pages.dashboard.servers.settings.block.unblockDialogTitle")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "pages.dashboard.servers.settings.block.unblockDialogDescription",
                {
                  reason: blockedState.data.reason,
                },
              )}
            </DialogDescription>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button
                  icon={ShieldCheck}
                  variant="destructive"
                  onClick={() => updateBlockState(false)}
                >
                  {t("pages.dashboard.servers.settings.block.unblockButton")}
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="secondary">
                  {t("pages.dashboard.servers.settings.block.closeButton")}
                </Button>
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
          {t("pages.dashboard.servers.settings.block.blockButton")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("pages.dashboard.servers.settings.block.blockDialogTitle")}
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-1">
            <p>
              {t(
                "pages.dashboard.servers.settings.block.blockDialogDescription",
              )}
            </p>
            <Input
              aria-label={t(
                "pages.dashboard.servers.settings.block.reasonLabel",
              )}
              placeholder={t(
                "pages.dashboard.servers.settings.block.reasonPlaceholder",
              )}
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
                {t("pages.dashboard.servers.settings.block.blockButton")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">
                {t("pages.dashboard.servers.settings.block.closeButton")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
