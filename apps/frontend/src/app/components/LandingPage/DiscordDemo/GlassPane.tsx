import type { ReactNode } from "react";

import { cn } from "@mc/ui";

import { useLandingPageParams } from "../LandingPageParamsContext";
import { buildBevelShadow } from "./demoEffect";

export function GlassPane({
  tilt,
  className,
  children,
}: {
  tilt?: { rotateX: number; rotateY: number };
  className?: string;
  children: ReactNode;
}) {
  const { params } = useLandingPageParams();

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md transition-[background-color] duration-300",
        className,
      )}
      style={{
        backgroundColor: `rgba(255,255,255,${params.glassOpacity})`,
        boxShadow: buildBevelShadow(tilt, params),
      }}
    >
      {children}
    </div>
  );
}
