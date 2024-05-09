import * as React from "react";
import NextLink from "next/link";

import { cn } from "@mc/ui";

const Link = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  React.ComponentPropsWithoutRef<typeof NextLink>
>(({ className, ...props }, ref) => (
  <NextLink ref={ref} className={cn("hover:underline", className)} {...props} />
));

export { Link };
