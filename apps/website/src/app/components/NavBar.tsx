"use client";

import { Major_Mono_Display } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@mc/ui";

import { env } from "~/env";
import { BotIcon } from "./BotIcon";

const major = Major_Mono_Display({ subsets: ["latin"], weight: "400" });

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center gap-4 text-sm lg:gap-6">
        <Link href="/" className="mr-auto">
          <div className="flex flex-row items-center">
            <BotIcon className="h-9 w-9" />
            <h1 className={cn(major.className, "ml-1 text-xl")}>
              Member counteR
            </h1>
          </div>
        </Link>
        <a
          href={env.NEXT_PUBLIC_SUPPORT_URL}
          target="_blank"
          rel="noreferer"
          className="text-muted-foreground hover:text-foreground"
        >
          Support
        </a>
        <Link
          href="/dashboard/servers"
          className={cn(
            { "text-muted-foreground": pathname !== "/dashboard/servers" },
            "hover:text-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/account"
          className={cn(
            { "text-muted-foreground": pathname !== "/account" },
            "hover:text-foreground",
          )}
        >
          Account
        </Link>
      </nav>
    </header>
  );
}
