import * as React from "react";

import { cn } from "@mc/ui";

const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      className,
    )}
    {...props}
  />
));

TypographyH2.displayName = "TypographyH2";

export { TypographyH2 };
