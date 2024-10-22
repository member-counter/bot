"use client";

import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

import { Routes } from "~/other/routes";

export const LoadGuildInput = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [guildId, setGuildId] = useState("");

  const loadGuild = (guildId: string) => {
    if (!guildId) return;
    router.push(Routes.DashboardServers(guildId));
  };

  return (
    <div className="flex flex-row gap-2">
      <Input
        value={guildId}
        onChange={(e) => setGuildId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && loadGuild(guildId)}
        placeholder={t("pages.admin.guilds.loadGuildInput.placeholder")}
      />
      <Button
        variant={"secondary"}
        onClick={() => loadGuild(guildId)}
        disabled={!guildId}
      >
        {t("pages.admin.guilds.loadGuildInput.loadButton")}
      </Button>
    </div>
  );
};
