import * as React from "react";

import { cn } from "@mc/ui";

const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  />
));

TypographyP.displayName = "TypographyP";

export { TypographyP };
