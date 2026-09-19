import { TrashIcon } from "lucide-react";
import { Trans } from "react-i18next";

import { routes } from "@mc/common/Routes";
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

import useShowError from "~/lib/hooks/useShowError";
import { useNavigate } from "~/lib/navigation";
import { api } from "~/lib/trpc";

export function DeleteButton() {
  const user = api.session.user.useQuery();
  const navigate = useNavigate();
  const deleteUser = api.user.delete.useMutation();
  const showError = useShowError();

  const deleteAccount = async () => {
    if (!user.data) return;

    try {
      await deleteUser.mutateAsync({ discordUserId: user.data.discordUserId });
      void navigate(routes.logout.$buildPath({}));
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
