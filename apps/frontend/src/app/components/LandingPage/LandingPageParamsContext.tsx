import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface LandingPageParams {
  tiltMaxY: number;
  tiltMaxX: number;
  screenshotTiltY: number;
  screenshotTiltX: number;
  perspective: number;
  depth: number;
  insetLightBlur: number;
  insetLightOpacity: number;
  outerShadowBlur: number;
  outerShadowOpacity: number;
  bevelLightOpacity: number;
  bevelDarkOpacity: number;
  bevelNormalize: number;
  glassOpacity: number;
  particleCount: number;
  particleSpeed: number;
  particleSize: number;
  particleOpacityMin: number;
  particleOpacityMax: number;
  particleFpsLimit: number;
  particleCenterX: number;
  particleCenterY: number;
  particleSmooth: boolean;
  voidCenterX: number;
  voidCenterY: number;
  voidInnerRadius: number;
  voidOuterRadius: number;
  screenshotMode: boolean;
  hideDemo: boolean;
}

export const defaultLandingPageParams: LandingPageParams = {
  tiltMaxY: 6,
  tiltMaxX: 4,
  screenshotTiltY: 10,
  screenshotTiltX: 0,
  perspective: 1200,
  depth: 0.5,
  insetLightBlur: 12,
  insetLightOpacity: 0.03,
  outerShadowBlur: 6,
  outerShadowOpacity: 0.4,
  bevelLightOpacity: 0.2,
  bevelDarkOpacity: 0.3,
  bevelNormalize: 6,
  glassOpacity: 0.06,
  particleCount: 2000,
  particleSpeed: 0.5,
  particleSize: 1,
  particleOpacityMin: 0.1,
  particleOpacityMax: 1,
  particleFpsLimit: 30,
  particleCenterX: 50,
  particleCenterY: 75,
  particleSmooth: true,
  voidCenterX: 50,
  voidCenterY: 75,
  voidInnerRadius: 15,
  voidOuterRadius: 50,
  screenshotMode: false,
  hideDemo: false,
};

interface LandingPageParamsContextValue {
  params: LandingPageParams;
  setParams: (partial: Partial<LandingPageParams>) => void;
  showUI: boolean;
  toggleUI: () => void;
}

const LandingPageParamsContext = createContext<LandingPageParamsContextValue>({
  params: defaultLandingPageParams,
  setParams: () => {
    /* empty */
  },
  showUI: false,
  toggleUI: () => {
    /* empty */
  },
});

export function LandingPageParamsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [params, setParamsState] = useState<LandingPageParams>(
    defaultLandingPageParams,
  );
  const [showUI, setShowUI] = useState(false);

  const setParams = useCallback((partial: Partial<LandingPageParams>) => {
    setParamsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleUI = useCallback(() => setShowUI((s) => !s), []);

  return (
    <LandingPageParamsContext.Provider
      value={{ params, setParams, showUI, toggleUI }}
    >
      {children}
    </LandingPageParamsContext.Provider>
  );
}

export function useLandingPageParams() {
  return useContext(LandingPageParamsContext);
}
