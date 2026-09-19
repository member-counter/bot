import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { Card, CardContent, CardHeader } from "@mc/ui/card";

import { useLocalStorage } from "~/lib/hooks/useLocalStorage";
import { api } from "~/lib/trpc";
import { DisplayUser } from "../DisplayUser";
import {
  defaultRecentUsers,
  recentUsersKey,
  recentUsersSchema,
} from "../recentUsersStorage";
import ManageUser from "./ManageUser";

export default function Page() {
  const { userId } = useTypedParams(routes.admin.users.user);

  const [recentUsers, setRecentUsers] = useLocalStorage(
    recentUsersKey,
    recentUsersSchema,
    defaultRecentUsers,
  );

  useEffect(() => {
    setRecentUsers([...new Set([userId, ...recentUsers])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const { t } = useTranslation();
  const discordUser = api.discord.getUser.useQuery({ id: userId });
  const user = api.user.get.useQuery(
    { discordUserId: userId },
    { throwOnError: true },
  );

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row">
        <DisplayUser {...{ id: userId, ...discordUser.data }} />
        {user.isLoading && (
          <LoaderIcon className="ml-auto h-5 w-5 animate-spin" />
        )}
      </CardHeader>
      {!user.data && !user.isLoading && (
        <CardContent className="flex h-full w-full flex-col items-center justify-center">
          <span>{t("pages.admin.users.userNotRegistered")}</span>
        </CardContent>
      )}
      {user.data && (
        <CardContent>
          <ManageUser {...{ userId }} />
        </CardContent>
      )}
    </Card>
  );
}
