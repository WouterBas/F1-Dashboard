export function remap(
  imageHeight: number,
  pos: number,
  min: number,
  maxY: number,
): number {
  const padding = imageHeight / 28;
  return (pos + min) / (maxY / (imageHeight - padding)) + padding / 2;
}
