import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook to prompt user confirmation before leaving page with unsaved changes.
 *
 * Note: In library mode (declarative routing), React Router doesn't provide
 * useBlocker. This hook only blocks browser navigation (refresh, close, back).
 * Internal React Router navigation is not blocked in library mode.
 */
function useConfirmOnLeave(shouldConfirm: boolean) {
  if (import.meta.env.DEV) shouldConfirm = false;
  const [t] = useTranslation();

  const warningText = t("hooks.useConfirmOnLeave");

  // Block browser navigation (page refresh, close, browser back/forward)
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

  // Note: useBlocker is not available in library mode (declarative routing).
  // If blocking internal navigation is critical, consider switching to data mode
  // with createBrowserRouter or implement a custom solution using navigation context.
}

export default useConfirmOnLeave;
