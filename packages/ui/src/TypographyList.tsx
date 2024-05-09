import * as React from "react";

import { cn } from "@mc/ui";

const TypographyUList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
    {...props}
  />
));

TypographyUList.displayName = "TypographyUList";

const TypographyOList = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
    {...props}
  />
));

TypographyOList.displayName = "TypographyOList";

export { TypographyUList, TypographyOList };
