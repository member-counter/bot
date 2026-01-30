import { useNavigate } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";
import { z } from "zod/v4";

import { LegalPagesSlugs, routes } from "@mc/common/Routes";
import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mc/ui/tabs";
import { TypographyH1 } from "@mc/ui/TypographyH1";

import Footer from "~/app/components/Footer";
import { legalPages } from "./legalPages";

export default function PageSwitcher() {
  const { page } = useTypedParams(routes.legal.page);
  const navigate = useNavigate();

  const selectedPage =
    z.enum(LegalPagesSlugs).safeParse(page).data ?? "terms-of-service";

  const setSelectedPage = (page: LegalPagesSlugs) => {
    void navigate(routes.legal.page.$buildPath({ params: { page } }), {
      replace: true,
    });
  };

  return (
    <>
      <Tabs
        defaultValue={selectedPage}
        value={selectedPage}
        onValueChange={(page) => setSelectedPage(page as LegalPagesSlugs)}
        className="m-auto max-w-[750px] break-words p-2"
      >
        <div className="flex flex-col gap-2">
          <TabListWrapper />
          {Object.entries(legalPages).map(([slug, { title, page }]) => (
            <TabsContent value={slug} key={slug}>
              <Card className="rounded-md">
                <CardHeader>
                  <TypographyH1>{title}</TypographyH1>
                </CardHeader>
                <CardContent>{page}</CardContent>
              </Card>
            </TabsContent>
          ))}
          <TabListWrapper />
        </div>
      </Tabs>
      <Footer />
    </>
  );
}

function TabListWrapper() {
  return (
    <TabsList className="grid h-full w-full grid-cols-2 sm:grid-cols-4">
      <TabsTrigger value="terms-of-service" className="w-full">
        Terms of Service
      </TabsTrigger>
      <TabsTrigger value="privacy-policy" className="w-full">
        Privacy Policy
      </TabsTrigger>
      <TabsTrigger value="cookie-policy" className="w-full">
        Cookie Policy
      </TabsTrigger>
      <TabsTrigger value="acceptable-use-policy" className="w-full">
        Acceptable Use Policy
      </TabsTrigger>
    </TabsList>
  );
}
