/* eslint-disable no-restricted-imports */
import type { MouseEvent } from "react";
import * as React from "react";
import { Link as RouterLink } from "react-router";

import { usePrefetchOnView } from "../hooks/usePrefetchOnView";
import { useNavigationBlocker } from "./NavigationBlockerContext";
import { isSpaNavigation } from "./utils";

type LinkProps = React.ComponentPropsWithoutRef<typeof RouterLink> & {
  onPrefetch?: () => void;
};

const Link = React.forwardRef<React.ElementRef<typeof RouterLink>, LinkProps>(
  ({ onClick, target, onPrefetch, ...props }, ref) => {
    const { showPrompt } = useNavigationBlocker();
    const prefetchRef = usePrefetchOnView<HTMLAnchorElement>(onPrefetch);

    // Merge the prefetch callback ref with the forwarded ref
    const mergedRef = React.useCallback(
      (element: HTMLAnchorElement | null) => {
        // Call the prefetch callback ref
        prefetchRef(element);

        // Handle the forwarded ref
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [prefetchRef, ref],
    );

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (isSpaNavigation(e, target) && !showPrompt()) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <RouterLink
        ref={mergedRef}
        onClick={handleClick}
        target={target}
        {...props}
      />
    );
  },
);

export { Link };
