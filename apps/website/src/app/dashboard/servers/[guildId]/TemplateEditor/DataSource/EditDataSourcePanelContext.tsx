import { createContext } from "react";

import type { EditDataSourceProps } from "./Options/EditDataSourceOptions";

export const EditDataSourcePanelContext = createContext<{
  pushEditStack: (stackItem: EditDataSourceProps) => void;
  popEditStack: (amount: number) => void;
}>({
  pushEditStack: () => void 0,
  popEditStack: () => void 0,
});
