import { createContext } from "react";

import type {
  AutosaveStatus,
  FormManagerState,
} from "~/lib/hooks/useFormManager";

export interface FormManagerContextValue {
  state: FormManagerState;
  autosave: AutosaveStatus;
}

export const FormManagerContext = createContext<FormManagerContextValue | null>(
  null,
);
