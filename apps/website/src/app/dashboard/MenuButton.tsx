import { useContext } from "react";
import { MenuIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import { MenuContext } from "./layout";

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
