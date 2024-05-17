"use client";

import { useMemo } from "react";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";
import { cn } from "@mc/ui";
import { Link } from "@mc/ui/Link";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

export default function Footer() {
  const isAuthenticated = api.session.isAuthenticated.useQuery();
  const user = api.session.user.useQuery(undefined);

  const userPermissions = useMemo(
    () => new BitField(user.data?.permissions ?? 0),
    [user.data],
  );

  return (
    <>
      <footer className="mt-auto flex flex-col border-t border-border/40">
        <div className=" bg-accent-background py-5">
          <div className="container flex flex-row  gap-[60px] py-0">
            <div className="flex  flex-col">
              <h3 className="pb-5 text-xl font-bold tracking-tight">
                Useful Links
              </h3>
              <Link href={Routes.Support}>Support server</Link>
              <Link href={Routes.Documentation}>Documentation</Link>
              <Link href={Routes.BotRepository}>Repository</Link>
              {!isAuthenticated.data ? (
                <Link href={Routes.Login}>Login with Discord</Link>
              ) : (
                <Link href={Routes.LogOut}>Logout</Link>
              )}
            </div>
            <div className="flex  flex-col">
              <h3 className="pb-5 text-xl font-bold tracking-tight">Legal</h3>
              <Link href={Routes.Legal("terms-of-service")}>
                Terms of Service
              </Link>
              <Link href={Routes.Legal("cookie-policy")}>Cookie Policy</Link>
              <Link href={Routes.Legal("privacy-policy")}>Privacy Policy</Link>
              <Link href={Routes.Legal("acceptable-use-policy")}>
                Acceptable Use Policy
              </Link>
            </div>
            <div
              className={cn("flex  flex-col", {
                hidden: !userPermissions.has(
                  UserPermissions.SeeUsers |
                    UserPermissions.ManageUsers |
                    UserPermissions.SeeGuilds |
                    UserPermissions.ManageGuilds,
                ),
              })}
            >
              <h3 className="pb-5 text-xl font-bold tracking-tight">Admin</h3>
              <Link
                href={Routes.ManageUsers()}
                className={cn("flex flex-col", {
                  hidden: !userPermissions.has(
                    UserPermissions.SeeUsers | UserPermissions.ManageUsers,
                  ),
                })}
              >
                Manage users
              </Link>
              <Link
                href={Routes.ManageGuilds}
                className={cn("flex flex-col", {
                  hidden: !userPermissions.has(
                    UserPermissions.SeeGuilds | UserPermissions.ManageGuilds,
                  ),
                })}
              >
                Manage servers
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 bg-[#090807] bg-background  py-4">
          <div className="container flex flex-row  py-0">
            <span className="">
              © 2024 Member Counter. All rights reserved. Created by{" "}
              <LinkUnderlined
                target="_blank"
                href="https://github.com/eduardozgz"
              >
                eduardozgz
              </LinkUnderlined>
              .
              <br />
              Made possible thanks to Alex,{" "}
              <LinkUnderlined
                target="_blank"
                href="https://github.com/VampireChicken12/"
              >
                VampireChicken
              </LinkUnderlined>
              ,{" "}
              <LinkUnderlined
                target="_blank"
                href="https://github.com/livingflore"
              >
                livingflore
              </LinkUnderlined>
              , Frosty and{" "}
              <LinkUnderlined href={Routes.Donors}>many more</LinkUnderlined>.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
