import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../../tailwind.config";
import { useMediaQuery } from "./useMediaQuery";

const fullConfig = resolveConfig(tailwindConfig);

export function useBreakpoint(
  breakpoint: keyof typeof fullConfig.theme.screens,
) {
  const screenBreakpoint = fullConfig.theme.screens[breakpoint];

  const isActive = useMediaQuery(`(min-width: ${screenBreakpoint})`);

  return isActive;
}
