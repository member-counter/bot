/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { Button } from "@mc/ui/button";

import { api } from "~/trpc/server";
import Footer from "../components/Footer";
import { DeleteButton } from "./DeleteButton";
import { DisplayUserBadges } from "./DisplayUserBadges";

export const metadata: Metadata = { title: "Account - Member Counter" };
export default async function Page() {
  const isAuthenticated = await api.session.isAuthenticated();
  if (!isAuthenticated) redirect("/login");

  const discordUser = await api.discord.identify();
  const user = await api.user.get({ id: discordUser.id });

  if (!user) throw new Error("User not found");

  return (
    <>
      <div className="my-8 flex flex-col gap-8">
        <div className="flex flex-row items-center justify-center gap-5">
          <img
            src={discordUser.avatar}
            alt={`${discordUser.username}'s avatar`}
            className="h-[128px] w-[128px] rounded-full"
          />
          <div className="i flex flex-col justify-center gap-3">
            <p>
              <span className="text-3xl text-foreground">
                {discordUser.username}
              </span>{" "}
              {discordUser.discriminator !== "0" && (
                <span className="text-1xl text-muted-foreground">
                  #{discordUser.discriminator}
                </span>
              )}
            </p>
            <Suspense>
              <DisplayUserBadges badges={user.badges} />
            </Suspense>
            <div className="flex flex-row gap-2">
              <DeleteButton />
              <Link href="/logout">
                <Button className="grow" size={"sm"} icon={LogOutIcon}>
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container"></div>
      </div>

      <Footer />
    </>
  );
}
