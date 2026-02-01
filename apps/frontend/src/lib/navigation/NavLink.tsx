/* eslint-disable no-restricted-imports */
import type { MouseEvent } from "react";
import * as React from "react";
import { NavLink as RouterNavLink } from "react-router";

import { useNavigationBlocker } from "./NavigationBlockerContext";
import { isSpaNavigation } from "./utils";

const NavLink = React.forwardRef<
  React.ElementRef<typeof RouterNavLink>,
  React.ComponentPropsWithoutRef<typeof RouterNavLink>
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
    <RouterNavLink ref={ref} onClick={handleClick} target={target} {...props} />
  );
});

export { NavLink };
