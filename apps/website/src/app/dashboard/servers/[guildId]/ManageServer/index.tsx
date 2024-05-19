import React from "react";

import { Separator } from "@mc/ui/separator";

import { ServerNav } from "./ServerNav";

interface Props {
  children: React.ReactNode;
}

export function ManageServer({ children }: Props) {
  return (
    <div className="flex h-full max-h-full">
      <ServerNav />
      <Separator orientation="vertical" />
      <div className="grow">{children}</div>
    </div>
  );
}
