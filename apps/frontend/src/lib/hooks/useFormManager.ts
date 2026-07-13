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

export interface FormManager<OT = unknown> {
  /** The original server value (query.data). */
  data: OT | null;
  /** The editable working copy. */
  value: OT | null;
  // The working copy is the output shape (OT); it's cast to the mutation input
  // (IT) on save. Consumers whose query output differs from their mutation
  // input (e.g. custom bots) rely on this.
  setValue: (value: OT) => void;
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
): FormManager<OT> {
  const [isDirty, setIsDirty] = useState(false);
  // Drives the SAVING state. Sourced from react-query (a useSyncExternalStore
  // store) rather than a local useState: manual saves run inside the
  // `<form action={save}>` React transition, which defers/coalesces local
  // setState updates — so an in-flight (or hanging) save would never commit a
  // visible SAVING frame. isPending is an urgent external-store update, so it
  // flips reliably even inside the transition.
  const isSaving = mutation.isPending;
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

  const setMutableData = (value: OT) => {
    _setMutableData(value);
    setIsDirty(true);
    // (Re)arm the countdown on every edit; each change pushes the deadline back
    // so we only save once the user pauses. This is the debounce.
    if (autosave) setAutosaveDeadline(Date.now() + AUTOSAVE_DEBOUNCE_MS);
  };

  const submitData = async () => {
    if (!mutableData) return;
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
      });
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
      // Swallow here: submitData already toasts via showError and re-throws for
      // callers that await save(). This fire-and-forget autosave must not leak
      // an unhandled rejection on every failed save.
      () => void submitData().catch(() => undefined),
      Math.max(0, autosaveDeadline - Date.now()),
    );
    return () => clearTimeout(timer);
    // submitData is intentionally excluded: its inputs are covered by
    // autosaveDeadline (bumped on every edit) and isSaving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autosave, autosaveDeadline, isSaving]);

  // Requires a live deadline too: after a failed save the deadline is cleared
  // but isDirty stays true, so without this a UI that renders `pending`
  // directly (rather than gating on secondsLeft like SaveButton does) would
  // stick on the autosaving state with nothing actually scheduled.
  const pending =
    autosave && isDirty && !isSaving && autosaveDeadline !== null;
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
