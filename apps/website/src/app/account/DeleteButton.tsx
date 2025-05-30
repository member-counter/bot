"use client";

import { TrashIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { Trans } from "react-i18next";

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

import useShowError from "~/hooks/useShowError";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

export function DeleteButton() {
  const router = useRouter();
  const user = api.session.user.useQuery();
  const deleteUser = api.user.delete.useMutation();
  const showError = useShowError();

  const deleteAccount = async () => {
    if (!user.data) return;

    try {
      await deleteUser.mutateAsync({ discordUserId: user.data.discordUserId });
      router.push(Routes.LogOut);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="grow"
          size={"sm"}
          variant={"destructive"}
          icon={TrashIcon}
        >
          <Trans i18nKey="pages.account.deleteButton.deleteAccountBtn" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="pages.account.deleteButton.confirmTitle" />
          </DialogTitle>
          <DialogDescription>
            <Trans i18nKey="pages.account.deleteButton.confirmDescription" />
          </DialogDescription>
          <DialogFooter className="sm:justify-between">
            <Button
              icon={TrashIcon}
              variant="destructive"
              onClick={deleteAccount}
            >
              <Trans i18nKey="pages.account.deleteButton.deleteAccountBtn" />
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">
                <Trans i18nKey="pages.account.deleteButton.closeBtn" />
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
