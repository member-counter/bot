import React, { createContext, useMemo, useState } from "react";

import { cn } from "@mc/ui";
import { Separator } from "@mc/ui/separator";

import { ServerNavMenu } from "./ServerNavMenu";

interface Props {
  children: React.ReactNode;
}

export const ServerNavMenuContext = createContext<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => void 0,
});

export function ManageServerLayout({ children }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuContextValue = useMemo(
    () => ({
      isOpen: isMenuOpen,
      setIsOpen: setIsMenuOpen,
    }),
    [isMenuOpen],
  );

  return (
    <ServerNavMenuContext.Provider value={menuContextValue}>
      <div className="flex h-full max-h-full">
        <ServerNavMenu
          className={cn("w-full sm:w-[240px] sm:min-w-[240px]", {
            "hidden sm:flex": !isMenuOpen,
          })}
        />
        <Separator orientation="vertical" className="hidden sm:block" />
        <div className={cn("grow", { "hidden sm:block": isMenuOpen })}>
          {children}
        </div>
      </div>
    </ServerNavMenuContext.Provider>
  );
}
