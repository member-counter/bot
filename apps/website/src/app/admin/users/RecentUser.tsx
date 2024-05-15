import React from "react";

import { Button } from "@mc/ui/button";

import { api } from "~/trpc/react";
import { DisplayUser } from "./DisplayUser";

interface Props {
  onClick: () => void;
  userId: string;
}

export const RecentUser = ({ userId, onClick }: Props) => {
  const discordUser = api.discord.getUser.useQuery({ id: userId });

  return (
    <Button onClick={onClick} className="py-8  text-start" variant="ghost">
      <div className="w-full py-8">
        <DisplayUser {...{ id: userId, ...discordUser.data }} />
      </div>
    </Button>
  );
};
