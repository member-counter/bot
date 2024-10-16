"use client";

import { useTranslation } from "react-i18next";

/* eslint-disable @next/next/no-img-element */
export const DisplayDemoServer = ({
  name,
  icon,
  priority,
}: {
  name: string;
  priority: number;
  icon?: string | null;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-row items-center gap-2">
      {icon && (
        <img src={icon} alt={``} aria-hidden className="h-8 w-8 rounded-md" />
      )}
      <div>
        <div>{name}</div>
        <div className="text-sm text-muted-foreground">
          {t("pages.admin.homePage.demoServers.list.display.priority", {
            priority: priority.toString(),
          })}
        </div>
      </div>
    </div>
  );
};
