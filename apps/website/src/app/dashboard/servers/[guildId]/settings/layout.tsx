"use client";

import { ServerCogIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Separator } from "@mc/ui/separator";

import { MenuButton } from "../../../Menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center justify-center pl-3 pr-1 font-semibold">
        <ServerCogIcon className="mr-3 h-5 w-5 sm:hidden" aria-hidden />
        <h1>{t("pages.dashboard.servers.settings.title")}</h1>
        <MenuButton />
      </div>
      <Separator orientation="horizontal" />
      <div className="grow overflow-hidden">
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}
