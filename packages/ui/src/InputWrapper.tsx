import * as React from "react";

import { cn } from "@mc/ui";

const InputWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-10 w-full cursor-text select-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));

InputWrapper.displayName = "InputWrapper";

export { InputWrapper };
