"use client";

import { Major_Mono_Display } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@mc/ui";

import { useTranslation } from "~/i18n/client";
import { Routes } from "~/other/routes";
import { BotIcon } from "./BotIcon";
import { LanguageSelector } from "./LanguageSelector";

const major = Major_Mono_Display({ subsets: ["latin"], weight: "400" });

export default function NavBar() {
  const pathname = usePathname();
  const [t] = useTranslation();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center gap-4 text-sm lg:gap-6">
        <Link href={Routes.Home} className="mr-auto">
          <div className="group flex flex-row items-center">
            <BotIcon className="h-9 w-9" />
            <h1
              className={cn(
                major.className,
                "ml-3 hidden py-3 text-xl transition-all group-hover:drop-shadow-[0_0_2px_#fff] sm:block",
              )}
            >
              Member counteR
            </h1>
          </div>
        </Link>
        <a
          href={Routes.Support}
          target="_blank"
          rel="noreferer"
          className="text-muted-foreground hover:text-foreground"
        >
          {t("components.NavBar.supportEntry")}
        </a>
        <Link
          href={Routes.Dashboard}
          className={cn(
            { "text-muted-foreground": !pathname.startsWith(Routes.Dashboard) },
            "hover:text-foreground",
          )}
        >
          {t("components.NavBar.dashboardEntry")}
        </Link>
        <Link
          href={Routes.Account}
          className={cn(
            { "text-muted-foreground": !pathname.startsWith(Routes.Account) },
            "hover:text-foreground",
          )}
        >
          {t("components.NavBar.accountEntry")}
        </Link>
        <LanguageSelector />
      </nav>
    </header>
  );
}
