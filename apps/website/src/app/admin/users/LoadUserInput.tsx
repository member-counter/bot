import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

import { Routes } from "~/other/routes";

export const LoadUserInput = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");

  const loadUser = (userId: string) => {
    if (!userId) return;
    router.push(Routes.ManageUsers(userId));
  };

  return (
    <div className="flex flex-row gap-2">
      <Input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && loadUser(userId)}
        placeholder="Paste user ID"
      />
      <Button
        variant={"secondary"}
        onClick={() => loadUser(userId)}
        disabled={!userId}
      >
        Load user
      </Button>
    </div>
  );
};
