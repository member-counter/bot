import * as React from "react";

import { cn } from "@mc/ui";

import { Link as BlockingLink } from "~/lib/navigation";

const Link = React.forwardRef<
  React.ElementRef<typeof BlockingLink>,
  React.ComponentPropsWithoutRef<typeof BlockingLink>
>(({ className, ...props }, ref) => (
  <BlockingLink
    ref={ref}
    className={cn("hover:underline", className)}
    {...props}
  />
));

export { Link };
