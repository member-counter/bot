"use client";;
import { use } from "react";

import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { TypographyH4 } from "@mc/ui/TypographyH4";

import { Errors } from "~/app/errors";
import { api } from "~/trpc/react";
import ManageDemoServer from "./ManageDemoServer";

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page(props: Props) {
  const params = use(props.params);

  const {
    id
  } = params;

  const { t } = useTranslation();
  const demoServer = api.demoServers.get.useQuery({ id });
  const router = useRouter();

  if (!demoServer.data && !demoServer.isLoading) {
    throw new Error(Errors.NotFound);
  }

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex h-20 flex-row items-center justify-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
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
