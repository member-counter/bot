"use client";

import { BotIcon } from "~/app/components/BotIcon";
import { MenuButton } from "../../MenuButton";

export function LoadingPage() {
  return (
    <div className="flex h-full flex-col p-1">
      <MenuButton />
      <div className="m-auto flex flex-col gap-2 p-3 sm:flex-row">
        <BotIcon className="m-auto h-24 w-24 animate-pulse" />
      </div>
    </div>
  );
}
