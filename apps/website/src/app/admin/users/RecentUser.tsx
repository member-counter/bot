/* eslint-disable @next/next/no-img-element */
import React from "react";

import { Button } from "@mc/ui/button";

import { api } from "~/trpc/react";

interface Props {
  onClick: () => void;
  userId: string;
}

export const RecentUser = ({ userId, onClick }: Props) => {
  const discordUser = api.discord.getUser.useQuery({ id: userId });

  return (
    <Button onClick={onClick} className="py-8  text-start" variant="ghost">
      <div className="flex w-full flex-row items-center gap-2 py-8">
        {discordUser.data ? (
          <UserTag {...discordUser.data} />
        ) : (
          <span className="text-muted-foreground">Uknown user {userId}</span>
        )}
      </div>
    </Button>
  );
};

const UserTag = ({
  username,
  discriminator,
  avatar,
}: {
  username: string;
  discriminator: string;
  avatar: string;
}) => (
  <>
    <img
      src={avatar}
      alt={`${username}'s avatar`}
      className="h-8 w-8 rounded-full"
    />
    <div>
      {username}
      {discriminator !== "0" && (
        <span className="text-muted-foreground">#{discriminator}</span>
      )}
    </div>
  </>
);
