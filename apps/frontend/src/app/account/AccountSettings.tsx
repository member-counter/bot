import { useId } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@mc/ui/card";
import { Label } from "@mc/ui/label";
import { Switch } from "@mc/ui/switch";

import { api } from "~/lib/trpc";

export function AccountSettings() {
  const { t } = useTranslation();
  const autosaveId = useId();
  const utils = api.useUtils();
  const user = api.session.user.useQuery();

  const updateUser = api.user.update.useMutation({
    onMutate: async ({ prefersAutosave }) => {
      await utils.session.user.cancel();
      const previous = utils.session.user.getData();
      utils.session.user.setData(undefined, (old) =>
        old
          ? { ...old, prefersAutosave: prefersAutosave ?? old.prefersAutosave }
          : old,
      );
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous)
        utils.session.user.setData(undefined, context.previous);
    },
    onSettled: () => {
      void utils.session.user.invalidate();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pages.account.settings.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor={autosaveId}>
              {t("pages.account.settings.autosave.label")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("pages.account.settings.autosave.description")}
            </p>
          </div>
          <Switch
            id={autosaveId}
            checked={user.data?.prefersAutosave ?? false}
            disabled={!user.isSuccess}
            onCheckedChange={(checked) =>
              user.data &&
              updateUser.mutate({
                id: user.data.id,
                prefersAutosave: !!checked,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
