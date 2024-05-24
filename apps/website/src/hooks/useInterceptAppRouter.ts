import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { use, useEffect } from "react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

// https://github.com/vercel/next.js/discussions/47020#discussioncomment-9352104
export function useInterceptAppRouter<TMethod extends keyof AppRouterInstance>(
  original: TMethod,
  interceptFn: (
    original: () => void,
    args: Parameters<AppRouterInstance[TMethod]>,
  ) => void,
): void {
  const appRouter = use(AppRouterContext);

  useEffect(() => {
    if (!appRouter)
      throw new Error(
        "useInterceptAppRouter must be used within an App Router context",
      );
    const originalMethod = appRouter[original];

    appRouter[original] = ((...args: Parameters<AppRouterInstance[TMethod]>) =>
      interceptFn(
        // @ts-expect-error args is not tuple?
        () => originalMethod(...args),
        args,
      )) as AppRouterInstance[TMethod];

    return () => {
      appRouter[original] = originalMethod;
    };
  }, [appRouter, original, interceptFn]);
}
