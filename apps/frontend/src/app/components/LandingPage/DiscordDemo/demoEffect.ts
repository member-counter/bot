// -- Tunable parameters for the 3D demo effect --

/** Max tilt angle in degrees (horizontal / vertical) */
export const TILT_MAX_Y = 6;
export const TILT_MAX_X = 4;

/** Static tilt for screenshot mode */
export const SCREENSHOT_TILT_Y = 10;
export const SCREENSHOT_TILT_X = 0;

/** Depth of the "magnifying glass" effect — scales shadow offset and inset light */
export const DEPTH = 0.5;

/** Inset diffuse light */
export const INSET_LIGHT_BLUR = 12;
export const INSET_LIGHT_OPACITY = 0.03;

/** Outer shadow */
export const OUTER_SHADOW_BLUR = 6;
export const OUTER_SHADOW_OPACITY = 0.4;

/** Bevel edge colors */
export const BEVEL_LIGHT_OPACITY = 0.2;
export const BEVEL_DARK_OPACITY = 0.3;

/** Normalization range — tilt values are clamped to ±this before bevel calc */
export const BEVEL_NORMALIZE = 6;

export interface BevelParams {
  depth: number;
  insetLightBlur: number;
  insetLightOpacity: number;
  outerShadowBlur: number;
  outerShadowOpacity: number;
  bevelLightOpacity: number;
  bevelDarkOpacity: number;
  bevelNormalize: number;
}

/** Builds inset bevel + outer shadow that follows the cursor/tilt direction.
 *  All 4 borders always visible — lit sides are light, opposite sides are dark,
 *  blending gradually based on cursor position. */
export function buildBevelShadow(
  tilt?: { rotateX: number; rotateY: number },
  params?: Partial<BevelParams>,
): string {
  const ry = tilt?.rotateY ?? 0;
  const rx = tilt?.rotateX ?? 0;

  const d = params?.depth ?? DEPTH;
  const ilBlur = params?.insetLightBlur ?? INSET_LIGHT_BLUR;
  const ilOp = params?.insetLightOpacity ?? INSET_LIGHT_OPACITY;
  const osBlur = params?.outerShadowBlur ?? OUTER_SHADOW_BLUR;
  const osOp = params?.outerShadowOpacity ?? OUTER_SHADOW_OPACITY;
  const blOp = params?.bevelLightOpacity ?? BEVEL_LIGHT_OPACITY;
  const bdOp = params?.bevelDarkOpacity ?? BEVEL_DARK_OPACITY;
  const bNorm = params?.bevelNormalize ?? BEVEL_NORMALIZE;

  // Map tilt to a -1..1 range for each axis
  const nx = Math.max(-1, Math.min(1, rx / bNorm));
  const ny = Math.max(-1, Math.min(1, ry / bNorm));

  const topT = (nx + 1) / 2; // 0 = dark, 1 = light
  const bottomT = (-nx + 1) / 2;
  const leftT = (-ny + 1) / 2;
  const rightT = (ny + 1) / 2;

  function edgeColor(t: number): string {
    const r = Math.round(255 * t);
    const g = r;
    const b = r;
    const a = +(bdOp + (blOp - bdOp) * t).toFixed(3);
    return `rgba(${r},${g},${b},${a})`;
  }

  return [
    `inset 0 1px 0 ${edgeColor(topT)}`,
    `inset 0 -1px 0 ${edgeColor(bottomT)}`,
    `inset 1px 0 0 ${edgeColor(leftT)}`,
    `inset -1px 0 0 ${edgeColor(rightT)}`,
    `inset ${ry * -d}px ${rx * d}px ${ilBlur}px rgba(255,255,255,${ilOp})`,
    `${ry * -d}px ${rx * d}px ${osBlur}px rgba(0,0,0,${osOp})`,
  ].join(", ");
}
