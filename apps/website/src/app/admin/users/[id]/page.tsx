"use client";

import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";

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
  }, [userId]);

  const discordUser = api.discord.getUser.useQuery(
    { id: userId },
    { throwOnError: true },
  );

  const user = api.user.get.useQuery({ id: userId }, { throwOnError: true });

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row">
        <DisplayUser {...{ id: userId, ...discordUser.data }} />
        {user.isLoading && (
          <LoaderIcon className="ml-auto h-5 w-5 animate-spin" />
        )}
      </CardHeader>
      {!user.data && (
        <CardContent className="flex h-full w-full flex-col items-center justify-center">
          <span>This user isn't registered.</span>
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
