"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { Input } from "@mc/ui/input";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { useLocalStorage } from "~/hooks/useLocalStorage";
import { RecentUser } from "./RecentUser";
import {
  defaultRecentUsers,
  recentUsersKey,
  recentUsersSchema,
} from "./recentUsers";

export function LoadUser() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [recentUsers, setRecentUsers] = useLocalStorage(
    recentUsersKey,
    recentUsersSchema,
    defaultRecentUsers,
  );

  const loadUser = (userId: string) => {
    if (!userId) return;
    setRecentUsers([...new Set([userId, ...recentUsers])]);
    router.push(`/admin/users/${userId}`);
  };

  return (
    <div className="container my-6 flex max-w-[500px] flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Paste User ID"
        />
        <Button
          variant={"secondary"}
          onClick={() => loadUser(userId)}
          disabled={!userId}
        >
          Load user
        </Button>
      </div>
      {!!recentUsers.length && (
        <Card>
          <CardHeader>
            <TypographyH4 className="mt-0">Recent users</TypographyH4>
          </CardHeader>
          <CardContent className="flex flex-col">
            {recentUsers.map((userId) => (
              <RecentUser
                userId={userId}
                key={userId}
                onClick={() => loadUser(userId)}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
