import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

export const LoadUserInput = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const loadUser = (userId: string) => {
    if (!userId) return;
    void navigate(routes.admin.users.user.$buildPath({ params: { userId } }));
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
        {t("pages.admin.users.loadUser")}
      </Button>
    </div>
  );
};
