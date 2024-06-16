export function remap(
  imageHeight: number,
  pos: number,
  min: number,
  maxY: number,
): number {
  const padding = imageHeight / 28;
  return (pos + min) / (maxY / (imageHeight - padding)) + padding / 2;
}

export function circuitSize(
  maxX: number,
  maxY: number,
  width: number,
): { scale: number; calcHeight: number; calcWidth: number } {
  const aspectRatio = maxX / maxY;
  if (aspectRatio > 1) {
    return {
      scale: maxX / (width - width / 10),
      calcHeight: width / aspectRatio + width / 20,
      calcWidth: width,
    };
  } else {
    return {
      scale: maxY / (width - width / 10),
      calcHeight: width,
      calcWidth: width * aspectRatio + width / 20,
    };
  }
}
