"use client";

import { useRouter } from "next/navigation";
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

export function DeleteButton({
  userId,
  disabled,
}: {
  userId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const deleteUser = api.user.delete.useMutation();

  const deleteAccount = async () => {
    await deleteUser.mutateAsync({ discordUserId: userId });
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} icon={TrashIcon} disabled={disabled}>
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <DialogFooter className="sm:justify-between">
            <Button
              icon={TrashIcon}
              variant="destructive"
              onClick={deleteAccount}
            >
              Delete account
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
