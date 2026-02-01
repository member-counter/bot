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

import useShowError from "~/lib/hooks/useShowError";
import { useNavigate } from "~/lib/navigation";
import { api } from "~/lib/trpc";

export function DeleteButton({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deleteMutation = api.demoServers.delete.useMutation();
  const showError = useShowError();

  const deleteCB = async () => {
    try {
      await deleteMutation.mutateAsync({ id });
      void navigate(-1);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} icon={TrashIcon} disabled={disabled}>
          {t("pages.admin.homePage.demoServers.delete.button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("pages.admin.homePage.demoServers.delete.dialogTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("pages.admin.homePage.demoServers.delete.dialogDescription")}
          </DialogDescription>
          <DialogFooter className="sm:justify-between">
            <Button icon={TrashIcon} variant="destructive" onClick={deleteCB}>
              {t("pages.admin.homePage.demoServers.delete.button")}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">
                {t("pages.admin.homePage.demoServers.delete.closeButton")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
