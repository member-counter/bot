import * as React from "react";

import { cn } from "@mc/ui";

const TypographyInlineCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className,
    )}
    {...props}
  />
));

TypographyInlineCode.displayName = "TypographyInlineCode";

export { TypographyInlineCode };
