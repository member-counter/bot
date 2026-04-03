import type { ReactNode } from "react";

import { cn } from "@mc/ui";

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
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md transition-[background-color] duration-300",
        className,
      )}
      style={{
        backgroundColor: "rgba(255,255,255,0.06)",
        boxShadow: buildBevelShadow(tilt),
      }}
    >
      {children}
    </div>
  );
}
