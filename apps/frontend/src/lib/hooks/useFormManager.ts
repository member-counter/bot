import type {
  UseTRPCMutationResult,
  UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { useState } from "react";

import useConfirmOnLeave from "~/lib/hooks/useConfirmOnLeave";
import useShowError from "./useShowError";

export const FormManagerState = {
  SAVED: "SAVED",
  UNSAVED: "UNSAVED",
  SAVING: "SAVING",
} as const;
export type FormManagerState =
  (typeof FormManagerState)[keyof typeof FormManagerState];

export function useFormManager<OT, IT>(
  query: UseTRPCQueryResult<OT, unknown>,
  mutation: UseTRPCMutationResult<unknown, unknown, IT, unknown>,
  key: string,
): [
  OT | null,
  OT | null,
  (newValue: IT) => void,
  () => Promise<void>,
  FormManagerState,
] {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mutableData, _setMutableData] = useState<OT | null>(
    query.data ? (structuredClone(query.data) as OT) : null,
  );
  const [prevKey, setPrevKey] = useState(key);
  const [prevQueryData, setPrevQueryData] = useState(query.data);
  const showError = useShowError();

  useConfirmOnLeave(isDirty);

  // Synchronously update mutableData during render when query.data changes
  // Using useEffect would cause a render with stale mutableData before the effect fires
  if (key !== prevKey) {
    // Key changed (e.g. navigated to a different entity) - always reset
    setPrevKey(key);
    setPrevQueryData(query.data);
    if (query.data) {
      _setMutableData(structuredClone(query.data) as OT);
    } else {
      _setMutableData(null);
    }
    setIsDirty(false);
  } else if (query.data !== prevQueryData) {
    // Same key, data changed (e.g. refetch) - only update if form is not dirty
    setPrevQueryData(query.data);
    if (query.data && !isDirty) {
      _setMutableData(structuredClone(query.data) as OT);
    }
  }

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
      // sync the cached query with what was just saved, so navigating away
      // and back doesn't resurrect pre-save values
      .then(() => query.refetch())
      .catch((error) => {
        showError(error);
        throw error;
      })
      .finally(() => setIsSaving(false));
  };

  const state: FormManagerState = isSaving
    ? FormManagerState.SAVING
    : isDirty
      ? FormManagerState.UNSAVED
      : FormManagerState.SAVED;

  return [query.data as OT, mutableData, setMutableData, submitData, state];
}
