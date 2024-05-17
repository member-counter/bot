import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

import { Routes } from "~/other/routes";

export const LoadGuildInput = () => {
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
        placeholder="Paste server ID"
      />
      <Button
        variant={"secondary"}
        onClick={() => loadGuild(guildId)}
        disabled={!guildId}
      >
        Load server
      </Button>
    </div>
  );
};
