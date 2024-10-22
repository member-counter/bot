"use client";

import { useTranslation } from "react-i18next";

import { DisplayUsername } from "~/app/components/DisplayUsername";

/* eslint-disable @next/next/no-img-element */
export const DisplayUser = ({
  id,
  username,
  discriminator,
  avatar,
}: {
  id: string;
  username?: string;
  discriminator?: string;
  avatar?: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center gap-2">
      {avatar && username && discriminator ? (
        <>
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className="h-8 w-8 rounded-full"
          />
          <DisplayUsername username={username} discriminator={discriminator} />
        </>
      ) : (
        <span className="text-muted-foreground">
          {t("common.unknownUser", { id })}
        </span>
      )}
    </div>
  );
};
