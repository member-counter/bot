import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@mc/ui/card";

import { DeleteButton } from "./DeleteButton";

export function DangerZone() {
  const { t } = useTranslation();

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">
          {t("pages.account.dangerZone.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DeleteButton />
      </CardContent>
    </Card>
  );
}
