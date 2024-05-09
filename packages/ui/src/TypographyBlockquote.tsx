import * as React from "react";

import { cn } from "@mc/ui";

const TypographyBlockquote = React.forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  />
));

TypographyBlockquote.displayName = "TypographyBlockquote";

export { TypographyBlockquote };
