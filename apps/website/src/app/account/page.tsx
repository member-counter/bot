/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import Footer from "../components/Footer";
import { DisplayUserBadges } from "./badges";

export const metadata: Metadata = { title: "Account - Member Counter" };
export default async function Page() {
  const isAuthenticated = await api.session.isAuthenticated();
  if (!isAuthenticated) redirect("/login");

  const discordUser = await api.discord.identify();
  const user = await api.user.get({ id: discordUser.id });

  if (!user) throw new Error("User not found");

  return (
    <>
      <div className="mt-10 flex flex-row justify-center gap-5">
        <img
          src={discordUser.avatar}
          alt={`${discordUser.username}'s avatar`}
          className="h-20 w-20 rounded-full"
        />
        <div className="i flex flex-col justify-center">
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
        </div>
      </div>
      <Footer />
    </>
  );
}
