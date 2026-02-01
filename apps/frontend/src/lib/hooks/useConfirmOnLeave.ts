import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useBlockerId, useNavigationBlocker } from "~/lib/navigation";

function useConfirmOnLeave(shouldConfirm: boolean, onBlocked?: () => void) {
  if (import.meta.env.DEV) shouldConfirm = false;
  const [t] = useTranslation();
  const { register, unregister } = useNavigationBlocker();
  const id = useBlockerId();

  const warningText = t("hooks.useConfirmOnLeave");

  useEffect(() => {
    if (shouldConfirm) {
      register(id, warningText, onBlocked);
    } else {
      unregister(id);
    }
    return () => {
      unregister(id);
    };
  }, [shouldConfirm, warningText, onBlocked, register, unregister, id]);
}

export default useConfirmOnLeave;
