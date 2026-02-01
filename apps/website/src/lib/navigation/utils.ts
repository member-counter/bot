import type { MouseEvent } from "react";

/**
 * Returns true if the click will trigger an SPA navigation (i.e. React Router
 * will handle it client-side). Returns false for new-tab/new-window actions
 * like middle-click, ctrl/cmd+click, shift+click, or target="_blank".
 *
 * This mirrors the same check React Router does internally before intercepting
 * a link click.
 */
export function isSpaNavigation(
  e: MouseEvent<HTMLAnchorElement>,
  target?: React.HTMLAttributeAnchorTarget,
): boolean {
  return (
    e.button === 0 &&
    (!target || target === "_self") &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.shiftKey &&
    !e.altKey
  );
}
