"use client";

import { createContext, useContext } from "react";
import { MenuIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

export const MenuContext = createContext<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => void 0,
});

export function MenuButton({ className }: { className?: string }) {
  const menuContext = useContext(MenuContext);

  return (
    <Button
      className={cn("ml-auto sm:hidden", className)}
      size={"icon"}
      variant={"ghost"}
      onClick={() => menuContext.setIsOpen(!menuContext.isOpen)}
    >
      <MenuIcon className="h-5 w-5" />
    </Button>
  );
}
