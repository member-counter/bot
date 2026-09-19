import type { LucideIcon } from "lucide-react";
import React from "react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

export const TinyIconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon }
>(({ className, icon: Icon, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      {...props}
      variant={"none"}
      className={cn(
        "h-5 w-5 text-muted-foreground hover:text-foreground",
        className,
      )}
      size={"icon"}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
});
