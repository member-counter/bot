import { useCallback, useRef } from "react";

/**
 * Returns event handlers that trigger a prefetch callback once, when the user
 * shows intent to interact with the element (hover or keyboard focus).
 *
 * Prefer this over prefetching everything that scrolls into view: a sidebar
 * full of items would otherwise fire its whole query bundle on mount.
 */
export function usePrefetchOnIntent(prefetch?: () => void) {
  const hasPrefetchedRef = useRef(false);

  const handleIntent = useCallback(() => {
    if (!prefetch || hasPrefetchedRef.current) return;
    hasPrefetchedRef.current = true;
    prefetch();
  }, [prefetch]);

  return { onMouseEnter: handleIntent, onFocus: handleIntent };
}
