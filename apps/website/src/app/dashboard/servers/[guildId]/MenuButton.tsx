import { useContext } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@mc/ui/button";

import { ServerNavMenuContext } from "./ManageServerLayout";

export function MenuButton() {
  const menuContext = useContext(ServerNavMenuContext);
  return (
    <Button
      className="ml-auto sm:hidden"
      size={"icon"}
      variant={"ghost"}
      onClick={() => menuContext.setIsOpen(true)}
    >
      <MenuIcon className="h-5 w-5" />
    </Button>
  );
}
