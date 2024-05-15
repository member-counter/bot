"use client";

import { cn } from "@mc/ui";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { useLocalStorage } from "~/hooks/useLocalStorage";
import { LoadUserInput } from "./LoadUserInput";
import { RecentUser } from "./RecentUser";
import {
  defaultRecentUsers,
  recentUsersKey,
  recentUsersSchema,
} from "./recentUsers";

export function RecentUsers({ className }: { className?: string }) {
  const [recentUsers] = useLocalStorage(
    recentUsersKey,
    recentUsersSchema,
    defaultRecentUsers,
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <LoadUserInput />
      {!!recentUsers.length && (
        <Card>
          <CardHeader>
            <TypographyH4 className="mt-0">Recent users</TypographyH4>
          </CardHeader>
          <CardContent className="flex flex-col">
            {recentUsers.map((userId) => (
              <RecentUser userId={userId} key={userId} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
