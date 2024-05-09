"use client";

import { Link } from "@mc/ui/Link";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { env } from "~/env";
import { api } from "~/trpc/react";

export default function Footer() {
  const isAuthenticated = api.user.isAuthenticated.useQuery();
  return (
    <>
      <footer className="mt-auto flex flex-col border-t border-border/40">
        <div className=" bg-accent-background py-5">
          <div className="container flex flex-row  gap-[60px] py-0">
            <div className="flex  flex-col">
              <h3 className="pb-5 text-xl font-bold tracking-tight">
                Useful Links
              </h3>
              <Link href={env.NEXT_PUBLIC_SUPPORT_URL}>Support server</Link>
              <Link href={env.NEXT_PUBLIC_BOT_DOCS_URL}>Documentation</Link>
              <Link href={env.NEXT_PUBLIC_BOT_REPO_URL}>Repository</Link>
              {!isAuthenticated.data ? (
                <Link href="/login">Login with Discord</Link>
              ) : (
                <Link href="/logout">Logout</Link>
              )}
            </div>
            <div className="flex  flex-col">
              <h3 className="pb-5 text-xl font-bold tracking-tight">Legal</h3>
              <Link href="/legal/terms-of-service">Terms of Service</Link>
              <Link href="/legal/privacy-policy">Privacy Policy</Link>
              <Link href="/legal/cookie-policy">Cookie Policy</Link>
              <Link href="/legal/acceptable-use-policy">
                Acceptable Use Policy
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
                rel="noreferrer"
                href="https://github.com/eduardozgz"
              >
                eduardozgz
              </LinkUnderlined>
              .
              <br />
              Made possible thanks to{" "}
              <LinkUnderlined
                target="_blank"
                rel="noreferrer"
                href="https://github.com/VampireChicken12/"
              >
                VampireChicken
              </LinkUnderlined>
              ,{" "}
              <LinkUnderlined
                target="_blank"
                rel="noreferrer"
                href="https://github.com/livingflore"
              >
                livingflore
              </LinkUnderlined>
              , Frosty and{" "}
              <LinkUnderlined href="/donors">many more</LinkUnderlined>.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
