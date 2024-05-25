import * as React from "react";

import { cn } from "@mc/ui";

const TypographyH4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "mt-6 scroll-m-20 text-xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));

TypographyH4.displayName = "TypographyH4";

export { TypographyH4 };
