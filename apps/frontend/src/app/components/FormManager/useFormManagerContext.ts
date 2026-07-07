import { useContext } from "react";

import type { FormManagerContextValue } from "./FormManagerContext";
import { FormManagerContext } from "./FormManagerContext";

export function useFormManagerContext(): FormManagerContextValue {
  const ctx = useContext(FormManagerContext);
  if (!ctx)
    throw new Error(
      "useFormManagerContext must be used within a <FormManagerProvider>",
    );
  return ctx;
}
