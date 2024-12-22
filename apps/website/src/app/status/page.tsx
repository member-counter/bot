"use client";

import { api } from "~/trpc/react";
import { BotIcon } from "../components/BotIcon";
import { BotStatus } from "./BotStats";

export default function StatusPage() {
  const status = api.bot.getStatus.useQuery(undefined, {
    refetchInterval: 1000,
  });

  if (!status.data)
    return (
      <div className="flex grow">
        <BotIcon className="m-auto h-24 w-24 animate-pulse" />
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-14 p-[18px]">
      {status.data.map((status) => (
        <BotStatus {...status} />
      ))}
    </div>
  );
}
