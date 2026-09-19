import { createContext } from "react";

export type SidePanelContextValue = HTMLElement | null;

export const SidePanelContext = createContext<SidePanelContextValue>(null);
