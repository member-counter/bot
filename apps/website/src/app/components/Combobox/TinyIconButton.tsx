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
      variant={"none"}
      className="h-5 w-5 text-muted-foreground hover:text-foreground"
      size={"icon"}
      aria-label="Remove item"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          onClick();
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
