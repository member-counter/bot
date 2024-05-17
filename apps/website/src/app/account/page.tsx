"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { Button } from "@mc/ui/button";
import { Skeleton } from "@mc/ui/skeleton";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import Footer from "../components/Footer";
import { DeleteButton } from "./DeleteButton";
import { DisplayUserBadges } from "./DisplayUserBadges";

export default function Page() {
  const isAuthenticated = api.session.isAuthenticated.useQuery();
  if (isAuthenticated.data === false) redirect(Routes.Login);

  const user = api.session.user.useQuery(undefined, {
    throwOnError: true,
    enabled: isAuthenticated.isSuccess,
  });

  const discordUser = api.discord.identify.useQuery(undefined, {
    throwOnError: true,
    enabled: isAuthenticated.isSuccess,
  });

  return (
    <>
      <div className="my-8 flex flex-col gap-8">
        <div className="flex flex-row items-center justify-center gap-5">
          {discordUser.isSuccess ? (
            <img
              src={discordUser.data.avatar}
              alt={`${discordUser.data.username}'s avatar`}
              className="background-forground h-[128px] w-[128px] rounded-full text-transparent"
            />
          ) : (
            <Skeleton className="h-[128px] w-[128px] rounded-full"></Skeleton>
          )}
          <div className="i flex flex-col justify-center gap-3">
            {discordUser.isSuccess ? (
              <p>
                <span className="text-3xl text-foreground">
                  {discordUser.data.username}
                </span>{" "}
                {discordUser.data.discriminator !== "0" && (
                  <span className="text-1xl text-muted-foreground">
                    #{discordUser.data.discriminator}
                  </span>
                )}
              </p>
            ) : (
              <Skeleton className="w-50 h-9" />
            )}
            {user.isSuccess && <DisplayUserBadges badges={user.data.badges} />}
            <div className="flex flex-row gap-2">
              <DeleteButton />
              <Link href={Routes.LogOut}>
                <Button className="grow" size={"sm"} icon={LogOutIcon}>
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
