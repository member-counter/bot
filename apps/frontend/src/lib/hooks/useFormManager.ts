import type {
  UseTRPCMutationResult,
  UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { useEffect, useState } from "react";

import useConfirmOnLeave from "~/lib/hooks/useConfirmOnLeave";
import useShowError from "./useShowError";

export const FormManagerState = {
  SAVED: "SAVED",
  UNSAVED: "UNSAVED",
  SAVING: "SAVING",
} as const;
export type FormManagerState =
  (typeof FormManagerState)[keyof typeof FormManagerState];

export interface AutosaveStatus {
  // An autosave is scheduled (form is dirty, autosave enabled, not yet saving).
  pending: boolean;
  // Epoch ms when the pending save fires; null when nothing is pending. Lets
  // the save button render a countdown.
  deadline: number | null;
}

export interface FormManager<OT = unknown, IT = unknown> {
  /** The original server value (query.data). */
  data: OT | null;
  /** The editable working copy. */
  value: OT | null;
  setValue: (value: IT) => void;
  save: () => Promise<void>;
  state: FormManagerState;
  autosave: AutosaveStatus;
}

// How long after the last edit an autosave fires. Also the countdown window.
const AUTOSAVE_DEBOUNCE_MS = 10_000;

export function useFormManager<OT, IT>(
  query: UseTRPCQueryResult<OT, unknown>,
  mutation: UseTRPCMutationResult<unknown, unknown, IT, unknown>,
  key: string,
  autosave = false,
): FormManager<OT, IT> {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mutableData, _setMutableData] = useState<OT | null>(
    query.data ? (structuredClone(query.data) as OT) : null,
  );
  const [prevKey, setPrevKey] = useState(key);
  const [prevQueryData, setPrevQueryData] = useState(query.data);
  // Epoch ms a pending autosave should fire; null when none is scheduled.
  const [autosaveDeadline, setAutosaveDeadline] = useState<number | null>(null);
  const showError = useShowError();

  // Warn before leaving with unsaved changes, autosave on or not.
  useConfirmOnLeave(isDirty);

  // Synchronously update mutableData during render when query.data changes.
  // Using useEffect would cause a render with stale mutableData before it fires.
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
    setAutosaveDeadline(null);
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
    // (Re)arm the countdown on every edit; each change pushes the deadline back
    // so we only save once the user pauses. This is the debounce.
    if (autosave) setAutosaveDeadline(Date.now() + AUTOSAVE_DEBOUNCE_MS);
  };

  const submitData = async () => {
    if (!mutableData) return;
    setIsSaving(true);
    setAutosaveDeadline(null);

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

  // Fire the pending save when its deadline arrives. Each edit resets the
  // deadline, which re-arms this timer — that is the debounce.
  useEffect(() => {
    if (!autosave || autosaveDeadline === null || isSaving) return;
    const timer = setTimeout(
      () => void submitData(),
      Math.max(0, autosaveDeadline - Date.now()),
    );
    return () => clearTimeout(timer);
    // submitData is intentionally excluded: its inputs are covered by
    // autosaveDeadline (bumped on every edit) and isSaving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autosave, autosaveDeadline, isSaving]);

  const pending = autosave && isDirty && !isSaving;
  const autosaveStatus: AutosaveStatus = {
    pending,
    deadline: pending ? autosaveDeadline : null,
  };

  return {
    data: query.data as OT,
    value: mutableData,
    setValue: setMutableData,
    save: submitData,
    state,
    autosave: autosaveStatus,
  };
}
