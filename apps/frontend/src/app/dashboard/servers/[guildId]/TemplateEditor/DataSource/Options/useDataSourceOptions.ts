import type { DataSource } from "@mc/common/DataSource";
import { useCallback, useEffect, useState } from "react";

export default function useDataSourceOptions<
  T extends DataSource["options"],
  MO,
>({
  unmergedOptions,
  defaultOptionsMerger,
  onOptionsChange,
}: {
  unmergedOptions: T;
  defaultOptionsMerger: (options: T) => MO;
  onOptionsChange: (newOptions: T) => void;
}): [MO, (newOptions: T) => void] {
  const [options, privateSetOptions] = useState(
    defaultOptionsMerger(unmergedOptions),
  );

  useEffect(
    () => privateSetOptions(defaultOptionsMerger(unmergedOptions)),
    [defaultOptionsMerger, unmergedOptions],
  );

  const publicSetOptions = useCallback(
    (newOptions: T) => {
      privateSetOptions({ ...options, ...newOptions });
      onOptionsChange({ ...options, ...newOptions });
    },
    [onOptionsChange, options],
  );

  return [options, publicSetOptions];
}
