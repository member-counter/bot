import type React from "react";
import { createContext } from "react";

export interface SidePanelContextValue {
  setNode: (node: React.ReactNode) => void;
}

export const SidePanelContext = createContext<SidePanelContextValue>({
  setNode: () => void 0,
});
