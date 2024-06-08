import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon } from "lucide-react";

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

const permissionsLabels: Record<keyof typeof UserPermissions, string> = {
  SeeUsers: "See Users",
  ManageUsers: "Manage Users",
  SeeGuilds: "See Servers",
  ManageGuilds: "Manage Servers",
} as const;

const badgesLabels: Record<keyof typeof UserBadgesBitfield, string> = {
  Donor: "Donor",
  Premium: "Premium",
  BetaTester: "Beta Tester",
  Translator: "Translator",
  Contributor: "Contributor",
  BigBrain: "Big Brain",
  BugCatcher: "Bug Catcher",
  PatPat: "Pat Pat",
  FoldingAtHome: "Folding@Home",
} as const;

export default function ManageUser({ userId }: { userId: string }) {
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

  return (
    <form action={saveUser}>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <TypographyH4 className="mt-0">Permissions</TypographyH4>
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
          <TypographyH4 className="mt-0">Badges</TypographyH4>
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
            <TypographyH4 className="mt-0">Transfer account</TypographyH4>
          </Checkbox>
          {enableTransfer && (
            <Input
              placeholder="Paste user ID"
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
          {userMutation.isSuccess && !isDirty ? "Saved" : "Save"}
        </Button>
      </CardFooter>
    </form>
  );
}
