import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

export function CreateInput() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const createDemoServer = api.demoServers.create.useMutation();
  const router = useRouter();

  const create = async () => {
    if (!name) return;
    const demoServer = await createDemoServer.mutateAsync({ name: name });
    router.push(Routes.ManageHomeDemoServer(demoServer.id));
  };

  return (
    <div className="flex flex-row gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && create()}
        placeholder={t(
          "pages.admin.homePage.demoServers.createInputPlaceholder",
        )}
      />
      <Button onClick={create} disabled={!name}>
        {t("pages.admin.homePage.demoServers.createBtn")}
      </Button>
    </div>
  );
}
