import * as React from "react";
import Link from "next/link";

import { cn } from "@mc/ui";

const LinkUnderlined = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, ...props }, ref) => (
  <Link ref={ref} className={cn("underline", className)} {...props} />
));

export { LinkUnderlined };
