import { TrashIcon } from "lucide-react";

import { Button } from "@mc/ui/button";

export function DeleteButton() {
  return (
    <Button
      className="grow"
      size={"sm"}
      variant={"destructive"}
      icon={TrashIcon}
    >
      Delete account
    </Button>
  );
}
