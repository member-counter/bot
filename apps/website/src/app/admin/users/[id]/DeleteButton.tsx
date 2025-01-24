"use client";

import { TrashIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
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

import useShowError from "~/hooks/useShowError";
import { api } from "~/trpc/react";

export function DeleteButton({
  userId,
  disabled,
}: {
  userId: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const deleteUser = api.user.delete.useMutation();
  const showError = useShowError();

  const deleteAccount = async () => {
    try {
      await deleteUser.mutateAsync({ discordUserId: userId });
      router.refresh();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} icon={TrashIcon} disabled={disabled}>
          {t("pages.admin.users.delete.button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("pages.admin.users.delete.dialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("pages.admin.users.delete.dialogDescription")}
          </DialogDescription>
          <DialogFooter className="sm:justify-between">
            <Button
              icon={TrashIcon}
              variant="destructive"
              onClick={deleteAccount}
            >
              {t("pages.admin.users.delete.button")}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">
                {t("pages.admin.users.delete.closeButton")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
