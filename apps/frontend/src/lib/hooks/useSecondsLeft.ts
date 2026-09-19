import { useEffect, useState } from "react";

/** Whole seconds until `deadline` (epoch ms), re-rendering as it counts down. */
export function useSecondsLeft(deadline: number | null): number {
  const [, tick] = useState(0);
  useEffect(() => {
    if (deadline === null) return;
    const interval = setInterval(() => tick((t) => t + 1), 250);
    return () => clearInterval(interval);
  }, [deadline]);

  if (deadline === null) return 0;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}
