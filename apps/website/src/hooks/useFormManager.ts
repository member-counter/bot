import type {
  UseTRPCMutationResult,
  UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { useEffect, useState } from "react";

import useConfirmOnLeave from "~/hooks/useConfirmOnLeave";

export enum FormManagerState {
  SAVED,
  UNSAVED,
  SAVING,
}

export function useFormManager<OT, IT>(
  query: UseTRPCQueryResult<OT, unknown>,
  mutation: UseTRPCMutationResult<unknown, unknown, IT, unknown>,
): [
  OT | null,
  OT | null,
  (newValue: IT) => void,
  () => Promise<void>,
  FormManagerState,
] {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mutableData, _setMutableData] = useState<OT | null>(null);

  useConfirmOnLeave(isDirty);

  useEffect(() => {
    if (!query.data) return;
    if (isDirty) return;
    _setMutableData(structuredClone(query.data) as OT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  const setMutableData = (value: IT) => {
    _setMutableData(value as unknown as OT);
    setIsDirty(true);
  };

  const submitData = async () => {
    if (!mutableData) return;
    setIsSaving(true);

    await mutation
      .mutateAsync({
        ...(mutableData as unknown as IT),
      })
      .then(() => setIsDirty(false))
      .finally(() => setIsSaving(false));
  };

  const state: FormManagerState = isSaving
    ? FormManagerState.SAVING
    : isDirty
      ? FormManagerState.UNSAVED
      : FormManagerState.SAVED;

  return [query.data as OT, mutableData, setMutableData, submitData, state];
}
