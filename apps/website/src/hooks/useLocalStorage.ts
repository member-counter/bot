import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: T,
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const unparsed = localStorage.getItem(key);

      if (!unparsed) return initialValue;

      return schema.parse(JSON.parse(unparsed));
    } catch {
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = (prevState) => {
    try {
      const valueToStore =
        prevState instanceof Function ? prevState(storedValue) : prevState;

      setStoredValue(valueToStore);

      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      /* empty */
    }
  };

  return [storedValue, setValue] as const;
}
