import * as React from "react";

import { cn } from "@mc/ui";

const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
    {...props}
  />
));

TypographyH1.displayName = "TypographyH1";

export { TypographyH1 };
