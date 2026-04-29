import { useCallback, useRef, useState } from "react";

import type { LandingPageParams } from "./LandingPageParamsContext";
import {
  defaultLandingPageParams,
  useLandingPageParams,
} from "./LandingPageParamsContext";

const STORAGE_KEY = "landing-page-params";

type ControlConfig =
  | {
      type: "slider";
      key: keyof LandingPageParams;
      label: string;
      min: number;
      max: number;
      step: number;
    }
  | {
      type: "checkbox";
      key: keyof LandingPageParams;
      label: string;
    };

const tiltControls: ControlConfig[] = [
  {
    type: "slider",
    key: "tiltMaxY",
    label: "Max Y",
    min: 0,
    max: 30,
    step: 0.5,
  },
  {
    type: "slider",
    key: "tiltMaxX",
    label: "Max X",
    min: 0,
    max: 30,
    step: 0.5,
  },
  {
    type: "slider",
    key: "screenshotTiltY",
    label: "Screenshot Y",
    min: -30,
    max: 30,
    step: 0.5,
  },
  {
    type: "slider",
    key: "screenshotTiltX",
    label: "Screenshot X",
    min: -30,
    max: 30,
    step: 0.5,
  },
  {
    type: "slider",
    key: "perspective",
    label: "Perspective",
    min: 200,
    max: 5000,
    step: 50,
  },
];

const glassControls: ControlConfig[] = [
  { type: "slider", key: "depth", label: "Depth", min: 0, max: 3, step: 0.05 },
  {
    type: "slider",
    key: "insetLightBlur",
    label: "Inset Light Blur",
    min: 0,
    max: 50,
    step: 1,
  },
  {
    type: "slider",
    key: "insetLightOpacity",
    label: "Inset Light Op.",
    min: 0,
    max: 0.3,
    step: 0.005,
  },
  {
    type: "slider",
    key: "outerShadowBlur",
    label: "Outer Shadow Blur",
    min: 0,
    max: 30,
    step: 1,
  },
  {
    type: "slider",
    key: "outerShadowOpacity",
    label: "Outer Shadow Op.",
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    type: "slider",
    key: "bevelLightOpacity",
    label: "Bevel Light Op.",
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    type: "slider",
    key: "bevelDarkOpacity",
    label: "Bevel Dark Op.",
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    type: "slider",
    key: "bevelNormalize",
    label: "Bevel Normalize",
    min: 1,
    max: 20,
    step: 0.5,
  },
  {
    type: "slider",
    key: "glassOpacity",
    label: "Glass BG Op.",
    min: 0,
    max: 0.3,
    step: 0.005,
  },
];

const voidControls: ControlConfig[] = [
  {
    type: "slider",
    key: "voidCenterX",
    label: "Center X %",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    type: "slider",
    key: "voidCenterY",
    label: "Center Y %",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    type: "slider",
    key: "voidInnerRadius",
    label: "Inner Radius %",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    type: "slider",
    key: "voidOuterRadius",
    label: "Outer Radius %",
    min: 0,
    max: 100,
    step: 1,
  },
];

const particleControls: ControlConfig[] = [
  {
    type: "slider",
    key: "particleCount",
    label: "Count",
    min: 0,
    max: 5000,
    step: 100,
  },
  {
    type: "slider",
    key: "particleSpeed",
    label: "Speed",
    min: 0,
    max: 20,
    step: 0.1,
  },
  {
    type: "slider",
    key: "particleSize",
    label: "Size",
    min: 0.5,
    max: 5,
    step: 0.5,
  },
  {
    type: "slider",
    key: "particleOpacityMin",
    label: "Opacity Min",
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    type: "slider",
    key: "particleOpacityMax",
    label: "Opacity Max",
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    type: "slider",
    key: "particleFpsLimit",
    label: "FPS Limit",
    min: 5,
    max: 120,
    step: 5,
  },
  {
    type: "slider",
    key: "particleCenterX",
    label: "Center X %",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    type: "slider",
    key: "particleCenterY",
    label: "Center Y %",
    min: 0,
    max: 100,
    step: 1,
  },
  { type: "checkbox", key: "particleSmooth", label: "Smooth" },
];

const generalControls: ControlConfig[] = [
  { type: "checkbox", key: "hideDemo", label: "Hide Demo" },
  { type: "checkbox", key: "screenshotMode", label: "Screenshot Mode" },
];

export function LandingPageParamsUI() {
  const { params, setParams, showUI, toggleUI } = useLandingPageParams();
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const dragging = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        setPos({
          x: dragging.current.origX + (e.clientX - dragging.current.startX),
          y: dragging.current.origY + (e.clientY - dragging.current.startY),
        });
      };

      const handleMouseUp = () => {
        dragging.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [pos.x, pos.y],
  );

  if (!showUI) return null;

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  };

  const handleLoad = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setParams(JSON.parse(saved) as Partial<LandingPageParams>);
      } catch {
        // ignore invalid data
      }
    }
  };

  const handleReset = () => {
    setParams({ ...defaultLandingPageParams });
  };

  const renderControl = (config: ControlConfig) => {
    if (config.type === "checkbox") {
      return (
        <label key={config.key} className="flex items-center gap-2 text-xs">
          <span className="w-[120px] shrink-0 text-right text-neutral-400">
            {config.label}
          </span>
          <input
            type="checkbox"
            checked={params[config.key] as boolean}
            onChange={(e) => setParams({ [config.key]: e.target.checked })}
            className="accent-blue-500"
          />
        </label>
      );
    }

    const value = params[config.key] as number;
    return (
      <label key={config.key} className="flex items-center gap-2 text-xs">
        <span className="w-[120px] shrink-0 text-right text-neutral-400">
          {config.label}
        </span>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) =>
            setParams({ [config.key]: parseFloat(e.target.value) })
          }
          className="h-1 w-full accent-blue-500"
        />
        <span className="w-[50px] shrink-0 tabular-nums text-neutral-300">
          {value}
        </span>
      </label>
    );
  };

  return (
    <div
      className="fixed z-[9999] flex max-h-[90vh] w-[380px] flex-col rounded-lg border border-neutral-700 bg-neutral-900/95 text-white shadow-2xl backdrop-blur-sm"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className="flex cursor-grab select-none items-center justify-between rounded-t-lg border-b border-neutral-700 bg-neutral-800 px-3 py-2 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-semibold">Tweaks</span>
        <button
          onClick={toggleUI}
          className="text-neutral-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto p-3">
        <details open>
          <summary className="cursor-pointer text-xs font-semibold uppercase text-neutral-300">
            Tilt
          </summary>
          <div className="mt-1 flex flex-col gap-1.5 pl-1">
            {tiltControls.map(renderControl)}
          </div>
        </details>

        <details open>
          <summary className="cursor-pointer text-xs font-semibold uppercase text-neutral-300">
            Glass / Bevel
          </summary>
          <div className="mt-1 flex flex-col gap-1.5 pl-1">
            {glassControls.map(renderControl)}
          </div>
        </details>

        <details open>
          <summary className="cursor-pointer text-xs font-semibold uppercase text-neutral-300">
            Particles
          </summary>
          <div className="mt-1 flex flex-col gap-1.5 pl-1">
            {particleControls.map(renderControl)}
          </div>
        </details>

        <details open>
          <summary className="cursor-pointer text-xs font-semibold uppercase text-neutral-300">
            Void (Gradient Overlay)
          </summary>
          <div className="mt-1 flex flex-col gap-1.5 pl-1">
            {voidControls.map(renderControl)}
          </div>
        </details>

        <details open>
          <summary className="cursor-pointer text-xs font-semibold uppercase text-neutral-300">
            Misc
          </summary>
          <div className="mt-1 flex flex-col gap-1.5 pl-1">
            {generalControls.map(renderControl)}
          </div>
        </details>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded bg-blue-600 px-2 py-1 text-xs font-medium hover:bg-blue-500"
          >
            Save
          </button>
          <button
            onClick={handleLoad}
            className="flex-1 rounded bg-neutral-700 px-2 py-1 text-xs font-medium hover:bg-neutral-600"
          >
            Load
          </button>
          <button
            onClick={handleReset}
            className="flex-1 rounded bg-neutral-700 px-2 py-1 text-xs font-medium hover:bg-neutral-600"
          >
            Reset
          </button>
        </div>
        <div className="mt-1 flex gap-2">
          <button
            onClick={() =>
              void navigator.clipboard.writeText(JSON.stringify(params))
            }
            className="flex-1 rounded bg-neutral-700 px-2 py-1 text-xs font-medium hover:bg-neutral-600"
          >
            Export to clipboard
          </button>
          <button
            onClick={() =>
              void navigator.clipboard.readText().then((text) => {
                try {
                  setParams(JSON.parse(text) as Partial<LandingPageParams>);
                } catch {
                  // ignore invalid data
                }
              })
            }
            className="flex-1 rounded bg-neutral-700 px-2 py-1 text-xs font-medium hover:bg-neutral-600"
          >
            Import from clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
