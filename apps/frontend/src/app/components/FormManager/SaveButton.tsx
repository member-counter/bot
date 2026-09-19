import { useMemo } from "react";
import { SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";

import { FormManagerState } from "~/lib/hooks/useFormManager";
import { useSecondsLeft } from "~/lib/hooks/useSecondsLeft";
import { useFormManagerContext } from "./useFormManagerContext";

/**
 * The Save button, which doubles as the Saved/Saving status. When an autosave
 * is counting down it shows the remaining time; clicking still saves
 * immediately. Reads form state from the surrounding FormManagerProvider.
 */
export function SaveButton({ disabled = false }: { disabled?: boolean }) {
  const { t, i18n } = useTranslation();
  const { state: formState, autosave } = useFormManagerContext();
  const secondsLeft = useSecondsLeft(autosave.deadline);

  const relativeTime = useMemo(
    () =>
      new Intl.RelativeTimeFormat(i18n.language, {
        style: "narrow",
        numeric: "always",
      }),
    [i18n.language],
  );

  const label =
    formState === FormManagerState.SAVED
      ? t("hooks.useFormManager.state.saved")
      : formState === FormManagerState.SAVING
        ? t("hooks.useFormManager.state.saving")
        : autosave.pending && secondsLeft > 0
          ? t("hooks.useFormManager.state.autosaveIn", {
              relativeTime: relativeTime.format(secondsLeft, "second"),
            })
          : t("hooks.useFormManager.state.save");

  return (
    <Button
      icon={SaveIcon}
      type="submit"
      disabled={
        disabled ||
        [FormManagerState.SAVED, FormManagerState.SAVING].includes(formState)
      }
    >
      {label}
    </Button>
  );
}
