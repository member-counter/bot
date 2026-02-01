import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { Errors } from "@mc/trpc-api/utils/errors";
import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { useNavigate } from "~/lib/navigation";
import { api } from "~/lib/trpc";
import ManageDemoServer from "./ManageDemoServer";

export default function Page() {
  const { id } = useTypedParams(routes.admin.homepage.demoServers.demoServer);

  const { t } = useTranslation();
  const demoServer = api.demoServers.get.useQuery({ id });
  const navigate = useNavigate();

  if (!demoServer.data && !demoServer.isLoading) {
    throw new Error(Errors.NotFound);
  }

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row items-center justify-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div className="grow"></div>
        <TypographyH4 className="mt-0">
          {t("pages.admin.homePage.demoServers.manage.title")}
        </TypographyH4>
        <div className="grow"></div>
        {demoServer.isLoading ? (
          <LoaderIcon className="h-5 w-5 animate-spin" />
        ) : (
          <div className="h-5 w-5"></div>
        )}
      </CardHeader>
      {demoServer.data && (
        <CardContent>
          <ManageDemoServer id={id} />
        </CardContent>
      )}
    </Card>
  );
}
