import { LogOutIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";
import { Skeleton } from "@mc/ui/skeleton";

import { api } from "~/lib/trpc";
import Footer from "../components/Footer";
import { DeleteButton } from "./DeleteButton";
import { DisplayUserBadges } from "./DisplayUserBadges";

export default function Page() {
  const { t } = useTranslation();

  const user = api.session.user.useQuery(undefined, {
    throwOnError: true,
  });

  const discordUser = api.discord.identify.useQuery(undefined, {
    throwOnError: true,
  });

  return (
    <>
      <div className="flex justify-center">
        <div className="flex w-full flex-col gap-4 p-4 sm:max-w-[600px]">
          <div className="my-8 flex gap-8 self-center">
            {discordUser.isSuccess ? (
              <img
                src={discordUser.data.avatar}
                alt={t("pages.account.page.avatarAlt", {
                  username: discordUser.data.username,
                })}
                className="background-forground h-[128px] w-[128px] rounded-full text-transparent"
              />
            ) : (
              <Skeleton className="h-[128px] w-[128px] rounded-full" />
            )}
            <div className="i flex flex-col justify-center gap-3">
              {discordUser.isSuccess ? (
                <p>
                  <span className="break-all text-3xl text-foreground">
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
              {user.isSuccess && (
                <DisplayUserBadges badges={user.data.badges} />
              )}
              <div className="flex flex-row flex-wrap gap-2">
                <DeleteButton />
                <Link to={routes.logout.$buildPath({})} className="grow">
                  <Button className="w-full" size={"sm"} icon={LogOutIcon}>
                    {t("pages.account.page.logoutButton")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
