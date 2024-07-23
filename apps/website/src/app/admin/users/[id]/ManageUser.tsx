import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BitField } from "@mc/common/BitField";
import { UserBadgesBitfield } from "@mc/common/UserBadges";
import { UserPermissions } from "@mc/common/UserPermissions";
import { Button } from "@mc/ui/button";
import { CardContent, CardFooter } from "@mc/ui/card";
import { Checkbox } from "@mc/ui/checkbox";
import { Input } from "@mc/ui/input";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import useConfirmOnLeave from "~/hooks/useConfirmOnLeave";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { DeleteButton } from "./DeleteButton";

const getPermissionsLabels = (t: TFunction) => ({
  SeeUsers: t("pages.admin.users.manage.permissions.seeUsers"),
  ManageUsers: t("pages.admin.users.manage.permissions.manageUsers"),
  SeeGuilds: t("pages.admin.users.manage.permissions.seeGuilds"),
  ManageGuilds: t("pages.admin.users.manage.permissions.manageGuilds"),
});

const getBadgesLabels = (t: TFunction) => ({
  Donor: t("pages.admin.users.manage.badges.donor"),
  Premium: t("pages.admin.users.manage.badges.premium"),
  BetaTester: t("pages.admin.users.manage.badges.betaTester"),
  Translator: t("pages.admin.users.manage.badges.translator"),
  Contributor: t("pages.admin.users.manage.badges.contributor"),
  BigBrain: t("pages.admin.users.manage.badges.bigBrain"),
  BugCatcher: t("pages.admin.users.manage.badges.bugCatcher"),
  PatPat: t("pages.admin.users.manage.badges.patPat"),
  FoldingAtHome: t("pages.admin.users.manage.badges.foldingAtHome"),
});

export default function ManageUser({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [enableTransfer, setEnableTransfer] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const authUser = api.session.user.useQuery().data;
  const authUserPerms = new BitField(authUser?.permissions);
  const canModify = authUserPerms.has(UserPermissions.ManageUsers);
  const user = api.user.get.useQuery({ discordUserId: userId });
  const userMutation = api.user.update.useMutation();
  const [mutableUser, _setMutableUser] = useState<typeof user.data | null>(
    null,
  );

  useConfirmOnLeave(isDirty);

  useEffect(() => {
    if (!user.data) return;
    _setMutableUser(user.data);
  }, [user.data]);

  if (!mutableUser) return;

  const setMutableUser = (value: typeof user.data) => {
    _setMutableUser(value);
    setIsDirty(true);
  };

  const saveUser = async () => {
    await userMutation.mutateAsync({
      ...mutableUser,
    });
    setIsDirty(false);

    if (enableTransfer)
      router.replace(Routes.ManageUsers(mutableUser.discordUserId));
  };

  const permissionsLabels = getPermissionsLabels(t);
  const badgesLabels = getBadgesLabels(t);

  return (
    <form action={saveUser}>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <TypographyH4 className="mt-0">
            {t("pages.admin.users.manage.permissions.title")}
          </TypographyH4>
          {Object.entries(permissionsLabels).map((entry) => {
            const [permission, label] = entry as [
              keyof typeof permissionsLabels,
              string,
            ];

            const permissionValue = UserPermissions[permission];

            return (
              <Checkbox
                key={permission}
                disabled={!canModify}
                checked={new BitField(mutableUser.permissions).has(
                  permissionValue,
                )}
                onCheckedChange={(checked) => {
                  setMutableUser({
                    ...mutableUser,
                    permissions: new BitField(mutableUser.permissions)[
                      checked ? "add" : "remove"
                    ](permissionValue).bitfield,
                  });
                }}
              >
                {label}
              </Checkbox>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <TypographyH4 className="mt-0">
            {t("pages.admin.users.manage.badges.title")}
          </TypographyH4>
          {Object.entries(badgesLabels).map((entry) => {
            const [badge, label] = entry as [keyof typeof badgesLabels, string];

            const badgeValue = UserBadgesBitfield[badge];

            return (
              <Checkbox
                key={badge}
                disabled={!canModify}
                checked={new BitField(mutableUser.badges).has(badgeValue)}
                onCheckedChange={(checked) => {
                  setMutableUser({
                    ...mutableUser,
                    badges: new BitField(mutableUser.badges)[
                      checked ? "add" : "remove"
                    ](badgeValue).bitfield,
                  });
                }}
              >
                {label}
              </Checkbox>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <Checkbox
            disabled={!canModify}
            checked={enableTransfer}
            onCheckedChange={(v) => setEnableTransfer(!!v)}
          >
            <TypographyH4 className="mt-0">
              {t("pages.admin.users.manage.transferAccount")}
            </TypographyH4>
          </Checkbox>
          {enableTransfer && (
            <Input
              placeholder={t("pages.admin.users.manage.pasteUserId")}
              value={mutableUser.discordUserId}
              onChange={(e) =>
                setMutableUser({
                  ...mutableUser,
                  discordUserId: e.target.value,
                })
              }
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <DeleteButton userId={userId} disabled={!canModify} />
        <Button
          icon={SaveIcon}
          type="submit"
          disabled={!canModify || !isDirty || userMutation.isPending}
        >
          {userMutation.isSuccess && !isDirty
            ? t("pages.admin.users.manage.saved")
            : t("pages.admin.users.manage.save")}
        </Button>
      </CardFooter>
    </form>
  );
}
