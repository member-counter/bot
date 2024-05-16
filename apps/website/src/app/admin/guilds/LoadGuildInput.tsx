import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

export const LoadGuildInput = () => {
  const router = useRouter();
  const [guildId, setGuildId] = useState("");

  const loadGuild = (userId: string) => {
    if (!userId) return;
    router.push(`/dashboard/servers/${userId}`);
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
