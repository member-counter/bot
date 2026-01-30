import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";

import useShowError from "~/lib/hooks/useShowError";
import { api } from "~/lib/trpc";

export function CreateInput() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const createDemoServer = api.demoServers.create.useMutation();
  const navigate = useNavigate();
  const showError = useShowError();

  const create = async () => {
    if (!name) return;

    try {
      const demoServer = await createDemoServer.mutateAsync({ name: name });

      await navigate(
        routes.admin.homepage.demoServers.demoServer.$buildPath({
          params: { id: demoServer.id },
        }),
      );
    } catch (err) {
      showError(err);
    }
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
