import React, { useContext } from "react";

import { cn } from "@mc/ui";
import { Separator } from "@mc/ui/separator";

import { MenuContext } from "~/app/dashboard/layout";
import { ServerNavMenu } from "./ServerNavMenu";

interface Props {
  children: React.ReactNode;
}

export function ManageServerLayout({ children }: Props) {
  const menuContext = useContext(MenuContext);

  return (
    <div className="flex h-full max-h-full">
      <ServerNavMenu
        className={cn("w-full sm:w-[240px] sm:min-w-[240px]", {
          "hidden sm:flex": !menuContext.isOpen,
        })}
      />
      <Separator orientation="vertical" className="hidden sm:block" />
      <div className={cn("grow", { "hidden sm:block": menuContext.isOpen })}>
        {children}
      </div>
    </div>
  );
}
