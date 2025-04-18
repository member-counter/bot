import type { UserBadges } from "@mc/common/UserBadges";
import type { TFunction } from "i18next";
import { useState } from "react";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useTranslation } from "react-i18next";

import { BitField } from "@mc/common/BitField";
import { UserBadgesBitfield } from "@mc/common/UserBadges";
import { UserPermissions } from "@mc/common/UserPermissions";
import { Button } from "@mc/ui/button";
import { Checkbox } from "@mc/ui/checkbox";
import { Form } from "@mc/ui/form";
import { Input } from "@mc/ui/input";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { FormManagerState, useFormManager } from "~/hooks/useFormManager";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { DeleteButton } from "./DeleteButton";

const getPermissionsLabels = (t: TFunction) =>
  ({
    SeeUsers: t("pages.admin.users.manage.permissions.seeUsers"),
    ManageUsers: t("pages.admin.users.manage.permissions.manageUsers"),
    SeeGuilds: t("pages.admin.users.manage.permissions.seeGuilds"),
    ManageGuilds: t("pages.admin.users.manage.permissions.manageGuilds"),
    ManageHomePage: t("pages.admin.users.manage.permissions.manageHomePage"),
    ManageDonations: t("pages.admin.users.manage.permissions.manageDonations"),
  }) satisfies Record<keyof typeof UserPermissions, string>;

const getBadgesLabels = (t: TFunction) =>
  ({
    Donor: t("pages.admin.users.manage.badges.donor"),
    Premium: t("pages.admin.users.manage.badges.premium"),
    BetaTester: t("pages.admin.users.manage.badges.betaTester"),
    Translator: t("pages.admin.users.manage.badges.translator"),
    Contributor: t("pages.admin.users.manage.badges.contributor"),
    BigBrain: t("pages.admin.users.manage.badges.bigBrain"),
    BugCatcher: t("pages.admin.users.manage.badges.bugCatcher"),
    PatPat: t("pages.admin.users.manage.badges.patPat"),
    FoldingAtHome: t("pages.admin.users.manage.badges.foldingAtHome"),
  }) satisfies Record<(typeof UserBadges)[number], string>;

export default function ManageUser({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [_user, mutableUser, setMutableUser, submitUser, formState] =
    useFormManager(
      api.user.get.useQuery({ discordUserId: userId }),
      api.user.update.useMutation(),
    );
  const [enableTransfer, setEnableTransfer] = useState(false);
  const authUser = api.session.user.useQuery().data;
  const authUserPerms = new BitField(authUser?.permissions);
  const canModify = authUserPerms.has(UserPermissions.ManageUsers);

  if (!mutableUser) return null;

  const saveUser = () => {
    void submitUser().then(() => {
      if (enableTransfer)
        router.replace(Routes.ManageUsers(mutableUser.discordUserId));
    });
  };

  const permissionsLabels = getPermissionsLabels(t);
  const badgesLabels = getBadgesLabels(t);

  return (
    <Form onSubmit={saveUser}>
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
      <div className="flex flex-row justify-between">
        <DeleteButton userId={userId} disabled={!canModify} />
        <Button
          icon={SaveIcon}
          type="submit"
          disabled={
            !canModify ||
            [FormManagerState.SAVED, FormManagerState.SAVING].includes(
              formState,
            )
          }
        >
          {formState === FormManagerState.SAVED
            ? t("hooks.useFormManager.state.saved")
            : formState === FormManagerState.SAVING
              ? t("hooks.useFormManager.state.saving")
              : t("hooks.useFormManager.state.save")}
        </Button>
      </div>
    </Form>
  );
}
