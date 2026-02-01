import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

interface Blocker {
  message: string;
  onBlocked?: () => void;
}

interface NavigationBlockerContextValue {
  register: (id: string, message: string, onBlocked?: () => void) => void;
  unregister: (id: string) => void;
  showPrompt: () => boolean;
}

const NavigationBlockerContext =
  createContext<NavigationBlockerContextValue | null>(null);

let nextId = 0;

export function useBlockerId() {
  const idRef = useRef<string>(undefined);
  idRef.current ??= `blocker-${String(nextId++)}`;
  return idRef.current;
}

export function NavigationBlockerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const blockersRef = useRef<Map<string, Blocker>>(new Map());

  const register = useCallback(
    (id: string, message: string, onBlocked?: () => void) => {
      blockersRef.current.set(id, { message, onBlocked });
    },
    [],
  );

  const unregister = useCallback((id: string) => {
    blockersRef.current.delete(id);
  }, []);

  const showPrompt = useCallback(() => {
    const first = blockersRef.current.values().next();
    if (first.done) return true;
    if (window.confirm(first.value.message)) return true;
    for (const blocker of blockersRef.current.values()) {
      blocker.onBlocked?.();
    }
    return false;
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const first = blockersRef.current.values().next();
      if (first.done) return;
      e.preventDefault();
      return (e.returnValue = first.value.message);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <NavigationBlockerContext value={{ register, unregister, showPrompt }}>
      {children}
    </NavigationBlockerContext>
  );
}

export function useNavigationBlocker() {
  const context = useContext(NavigationBlockerContext);
  if (!context) {
    throw new Error(
      "useNavigationBlocker must be used within a NavigationBlockerProvider",
    );
  }
  return context;
}
