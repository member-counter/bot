import { useState } from "react";
import { useTranslation } from "react-i18next";

import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

import { useNavigate } from "~/lib/navigation";

export const LoadGuildInput = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [guildId, setGuildId] = useState("");

  const loadGuild = (guildId: string) => {
    if (!guildId) return;
    void navigate(
      routes.dashboard.servers.server.$buildPath({ params: { guildId } }),
    );
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
