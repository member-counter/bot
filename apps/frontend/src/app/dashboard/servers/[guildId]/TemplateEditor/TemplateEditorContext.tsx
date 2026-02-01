import type { Grammar } from "prismjs";
import { createContext } from "react";

export const TemplateEditorContext = createContext<{
  features: Grammar;
  disabled: boolean;
}>({
  features: {},
  disabled: false,
});
