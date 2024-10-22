"use client";

import { useRouter } from "next-nprogress-bar";

import { Button } from "@mc/ui/button";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { DisplayDemoServer } from "./DisplayDemoServer";

export const ListDemoServers = () => {
  const demoServers = api.demoServers.geAll.useQuery();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {demoServers.data?.map((demoServer) => (
        <Button
          onClick={() =>
            router.push(Routes.ManageHomeDemoServer(demoServer.id))
          }
          className="py-8 text-start"
          variant="ghost"
          key={demoServer.id}
        >
          <DisplayDemoServer {...demoServer} />
        </Button>
      ))}
    </div>
  );
};
