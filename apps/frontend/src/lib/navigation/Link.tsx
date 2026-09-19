/* eslint-disable no-restricted-imports */
import type { MouseEvent } from "react";
import * as React from "react";
import { Link as RouterLink } from "react-router";

import { usePrefetchOnIntent } from "../hooks/usePrefetchOnIntent";
import { useNavigationBlocker } from "./NavigationBlockerContext";
import { isSpaNavigation } from "./utils";

type LinkProps = React.ComponentPropsWithoutRef<typeof RouterLink> & {
  onPrefetch?: () => void;
};

const Link = React.forwardRef<React.ElementRef<typeof RouterLink>, LinkProps>(
  ({ onClick, onMouseEnter, onFocus, target, onPrefetch, ...props }, ref) => {
    const { showPrompt } = useNavigationBlocker();
    const prefetchOnIntent = usePrefetchOnIntent(onPrefetch);

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (isSpaNavigation(e, target) && !showPrompt()) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <RouterLink
        ref={ref}
        onClick={handleClick}
        onMouseEnter={(e) => {
          onMouseEnter?.(e);
          prefetchOnIntent.onMouseEnter();
        }}
        onFocus={(e) => {
          onFocus?.(e);
          prefetchOnIntent.onFocus();
        }}
        target={target}
        {...props}
      />
    );
  },
);

export { Link };
