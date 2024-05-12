"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader } from "@mc/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mc/ui/tabs";
import { TypographyH1 } from "@mc/ui/TypographyH1";

import { legalPages, legalPagesSlugs } from "./legalPages";

export default function PageSwitcher() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedPage =
    z.enum(legalPagesSlugs).safeParse(searchParams.get("page")).data ??
    "terms-of-service";

  const setSelectedPage = (page: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Tabs
        defaultValue={selectedPage}
        value={selectedPage}
        onValueChange={(page) => setSelectedPage(page)}
        className="m-auto my-2 w-[750px] break-words"
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
    </>
  );
}

function TabListWrapper() {
  return (
    <TabsList className="grid w-full grid-cols-4">
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
