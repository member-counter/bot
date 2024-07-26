"use client";

import { TrashIcon } from "lucide-react";
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

import { api } from "~/trpc/react";

export function ResetSettings({
  guildId,
  disabled,
  className,
}: {
  className?: string;
  guildId: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const resetSettingsMutation = api.guild.reset.useMutation();
  const settingsMutation = api.guild.get.useQuery({ discordGuildId: guildId });

  const resetSettings = async () => {
    await resetSettingsMutation.mutateAsync({ discordGuildId: guildId });
    await settingsMutation.refetch();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          icon={TrashIcon}
          disabled={disabled}
          className={className}
        >
          {t("pages.dashboard.servers.settings.reset.resetButton")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("pages.dashboard.servers.settings.reset.dialogTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("pages.dashboard.servers.settings.reset.dialogDescription")}
          </DialogDescription>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button
                icon={TrashIcon}
                variant="destructive"
                onClick={resetSettings}
              >
                {t("pages.dashboard.servers.settings.reset.resetButton")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">
                {t("pages.dashboard.servers.settings.reset.closeButton")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
