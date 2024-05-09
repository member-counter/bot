"use client";

import { Link } from "@mc/ui/Link";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { env } from "~/env";
import { api } from "~/trpc/react";

export default function Footer() {
  const isAuthenticated = api.user.isAuthenticated.useQuery();
  return (
    <footer className="absolute bottom-0 left-0 right-0 flex flex-col">
      <div className="flex flex-row gap-[60px]  bg-zinc-900 p-5 md:px-20">
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
          <Link href="/legal/terms-of-service">Support server</Link>
          <Link href="/legal/privacy-policy">Privacy Policy</Link>
          <Link href="/legal/cookie-policy">Cookie Policy</Link>
          <Link href="/legal/acceptable-use-policy">Acceptable Use Policy</Link>
        </div>
      </div>
      <div className="flex flex-row bg-zinc-950 p-4 md:px-20">
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
          , Frosty and <LinkUnderlined href="/donors">many more</LinkUnderlined>
        </span>
      </div>
    </footer>
  );
}
