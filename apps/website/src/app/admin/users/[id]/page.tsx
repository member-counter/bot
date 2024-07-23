"use client";

import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader } from "@mc/ui/card";

import { useLocalStorage } from "~/hooks/useLocalStorage";
import { api } from "~/trpc/react";
import { DisplayUser } from "../DisplayUser";
import {
  defaultRecentUsers,
  recentUsersKey,
  recentUsersSchema,
} from "../recentUsers";
import ManageUser from "./ManageUser";

interface Props {
  params: { id: string };
}

export default function Page({ params: { id: userId } }: Props) {
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
      {user.data && <ManageUser {...{ userId }} />}
    </Card>
  );
}
