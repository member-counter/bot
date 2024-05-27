import React, { createContext } from "react";

export type SidePanelContextValue = React.RefObject<HTMLElement>;

export const SidePanelContext = createContext<SidePanelContextValue>(
  React.createRef(),
);
