export const IMAGES_PER_ROW = 30;
export const IMAGE_RES = 30;

export function indexToCoords(
  index: number,
  imageRes: number,
  canvasWidth: number,
): [number, number] {
  const cols = canvasWidth / imageRes;
  const row = Math.floor(index / cols);
  const col = index % cols;
  return [col * imageRes, row * imageRes];
}

export function cleanFromVariationSelectors(str: string) {
  return str.replaceAll(/\uFE0F/g, "");
}
