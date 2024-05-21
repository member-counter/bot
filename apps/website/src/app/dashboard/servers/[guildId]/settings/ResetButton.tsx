"use client";

import { TrashIcon } from "lucide-react";

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
          Reset settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All the settings will be reset to the
            defaults
          </DialogDescription>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button
                icon={TrashIcon}
                variant="destructive"
                onClick={resetSettings}
              >
                Reset settings
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
