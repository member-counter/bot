import * as React from "react";

import { cn } from "@mc/ui";

const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));

TypographyH3.displayName = "TypographyH3";

export { TypographyH3 };
