import type { ReactNode } from "react";
import { useMemo } from "react";

import type { FormManager } from "~/lib/hooks/useFormManager";
import { FormManagerContext } from "./FormManagerContext";

/**
 * Exposes a form's state + autosave status to descendants (the SaveButton) so
 * they don't need it threaded through props. Accepts a whole `useFormManager`
 * result, or a bare `{ state, autosave }` for forms that don't use the hook.
 */
export function FormManagerProvider({
  value,
  children,
}: {
  value: Pick<FormManager, "state" | "autosave">;
  children: ReactNode;
}) {
  const ctx = useMemo(
    () => ({ state: value.state, autosave: value.autosave }),
    // Depend on the primitive fields, not the `autosave` object: useFormManager
    // recreates it every render, which would make this memo (and the context
    // value) churn on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value.state, value.autosave.pending, value.autosave.deadline],
  );
  return (
    <FormManagerContext.Provider value={ctx}>
      {children}
    </FormManagerContext.Provider>
  );
}
