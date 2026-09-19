import { useTranslation } from "react-i18next";

import { routes } from "@mc/common/Routes";
import { cn } from "@mc/ui";

import { Link, NavLink } from "~/lib/navigation";
import { BotIcon } from "./BotIcon";
import { LanguageSelector } from "./LanguageSelector";

export default function NavBar() {
  const [t] = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-14 items-center gap-4 px-[18px] text-sm lg:gap-6">
        <Link to={routes.$buildPath({})} className="mr-auto">
          <div className="group flex flex-row items-center">
            <BotIcon className="h-9 w-9" />
            <h1
              className={
                "font-major-mono ml-5 hidden py-3 text-xl transition-all group-hover:drop-shadow-[0_0_2px_#fff] sm:block"
              }
            >
              Member counteR
            </h1>
          </div>
        </Link>
        <a
          href={routes.support.$buildPath({})}
          target="_blank"
          rel="noreferer"
          className="text-muted-foreground hover:text-foreground"
        >
          {t("components.NavBar.supportEntry")}
        </a>
        <NavLink
          to={routes.dashboard.$buildPath({})}
          className={({ isActive }) =>
            cn("text-muted-foreground hover:text-foreground", {
              "text-foreground": isActive,
            })
          }
        >
          {t("components.NavBar.dashboardEntry")}
        </NavLink>
        <NavLink
          to={routes.account.$buildPath({})}
          className={({ isActive }) =>
            cn("text-muted-foreground hover:text-foreground", {
              "text-foreground": isActive,
            })
          }
        >
          {t("components.NavBar.accountEntry")}
        </NavLink>
        <LanguageSelector />
      </nav>
    </header>
  );
}
