import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { Input } from "@mc/ui/input";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { CreateInput } from "./CreateInput";
import { ListDemoServers } from "./ListDemoServers";

export function DemoServers() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <TypographyH4 className="mt-0">
          {t("pages.admin.homePage.demoServers.title")}
        </TypographyH4>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CreateInput />
        <ListDemoServers />
      </CardContent>
    </Card>
  );
}
