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

export function DeleteButton() {
  const router = useRouter();
  const user = api.session.user.useQuery();
  const deleteUser = api.user.delete.useMutation();

  const deleteAccount = async () => {
    if (!user.data) return;

    await deleteUser.mutateAsync({ id: user.data.discordUserId });

    router.push("/logout");
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
          Delete account
        </Button>
      </DialogTrigger>
      {/* // Thank you shad for providing me exactly the text I wanted in your dialog example lol */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
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
