import { useCallback, useEffect } from "react";

import { env } from "~/env";
import { useTranslation } from "~/i18n/client";
import { useInterceptAppRouter } from "./useInterceptAppRouter";

function useConfirmOnLeave(shouldConfirm: boolean) {
  if (env.NODE_ENV === "development") shouldConfirm = false;
  const [t] = useTranslation();

  const warningText = t("hooks.useConfirmOnLeave");

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldConfirm) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConfirm, warningText]);

  const handleRouterChange = useCallback(
    (proceed: () => void) => {
      if (!shouldConfirm) {
        proceed();
        return;
      }

      if (window.confirm(warningText)) {
        proceed();
      }
    },
    [shouldConfirm, warningText],
  );

  useInterceptAppRouter("back", handleRouterChange);
  useInterceptAppRouter("forward", handleRouterChange);
  useInterceptAppRouter("push", handleRouterChange);
  useInterceptAppRouter("refresh", handleRouterChange);
  useInterceptAppRouter("replace", handleRouterChange);
}

export default useConfirmOnLeave;
