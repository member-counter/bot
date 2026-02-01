import type { MouseEvent } from "react";
import * as React from "react";
import { Link as RouterLink } from "react-router";

import { useNavigationBlocker } from "./NavigationBlockerContext";
import { isSpaNavigation } from "./utils";

const Link = React.forwardRef<
  React.ElementRef<typeof RouterLink>,
  React.ComponentPropsWithoutRef<typeof RouterLink>
>(({ onClick, target, ...props }, ref) => {
  const { showPrompt } = useNavigationBlocker();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isSpaNavigation(e, target) && !showPrompt()) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <RouterLink ref={ref} onClick={handleClick} target={target} {...props} />
  );
});

export { Link };
