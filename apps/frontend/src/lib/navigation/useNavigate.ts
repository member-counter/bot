/* eslint-disable no-restricted-imports */
import type { NavigateOptions, To } from "react-router";
import { useCallback } from "react";
import { useNavigate as useRouterNavigate } from "react-router";

import { useNavigationBlocker } from "./NavigationBlockerContext";

interface BlockingNavigateFunction {
  (to: To, options?: NavigateOptions): void | Promise<void>;
  (delta: number): void | Promise<void>;
}

export function useNavigate(): BlockingNavigateFunction {
  const routerNavigate = useRouterNavigate();
  const { showPrompt } = useNavigationBlocker();

  return useCallback(
    (to: To | number, options?: NavigateOptions): void | Promise<void> => {
      if (!showPrompt()) return;
      if (typeof to === "number") {
        return routerNavigate(to);
      } else {
        return routerNavigate(to, options);
      }
    },
    [routerNavigate, showPrompt],
  ) as BlockingNavigateFunction;
}
