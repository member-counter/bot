import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mc/ui/button";

import { api } from "~/trpc/react";
import { DisplayUser } from "./DisplayUser";

interface Props {
  userId: string;
}

export const RecentUser = ({ userId }: Props) => {
  const router = useRouter();
  const discordUser = api.discord.getUser.useQuery({ id: userId });

  return (
    <Button
      onClick={() => router.push(`/admin/users/${userId}`)}
      className="py-8 text-start"
      variant="ghost"
    >
      <div className="w-full py-8">
        <DisplayUser {...{ id: userId, ...discordUser.data }} />
      </div>
    </Button>
  );
};
