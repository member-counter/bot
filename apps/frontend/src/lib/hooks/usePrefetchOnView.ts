import { useCallback, useRef } from "react";

/**
 * Hook that triggers a prefetch callback when the element enters the viewport
 * @param prefetch - Callback to execute when element enters viewport
 * @param options - IntersectionObserver options
 * @returns Callback ref to attach to the element
 */
export function usePrefetchOnView<T extends HTMLElement>(
  prefetch?: () => void,
  options?: IntersectionObserverInit,
) {
  const hasPrefetchedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const callbackRef = useCallback(
    (element: T | null) => {
      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!prefetch || !element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasPrefetchedRef.current) {
              hasPrefetchedRef.current = true;
              prefetch();
            }
          });
        },
        {
          ...options,
        },
      );

      observer.observe(element);
      observerRef.current = observer;
    },
    [prefetch, options],
  );

  return callbackRef;
}
