import * as React from "react";
import { Link as ReactRouterLink } from "react-router";

import { cn } from "@mc/ui";

// TODO intercept navigation on dirty forms from some contextual menu

const Link = React.forwardRef<
  React.ElementRef<typeof ReactRouterLink>,
  React.ComponentPropsWithoutRef<typeof ReactRouterLink>
>(({ className, ...props }, ref) => (
  <ReactRouterLink
    ref={ref}
    className={cn("hover:underline", className)}
    {...props}
  />
));

export { Link };
