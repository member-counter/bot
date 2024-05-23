import type { LucideIcon } from "lucide-react";

import { Button } from "@mc/ui/button";

export const TinyIconButton = ({
  icon: Icon,
  onClick,
}: {
  icon: LucideIcon;
  onClick: () => void;
}) => {
  return (
    <Button
      variant={"ghost"}
      className="h-5 w-5"
      size={"icon"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
