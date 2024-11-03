export function mapToCenter(
  points: { x: number; y: number }[],
  center: { x: number; y: number },
  angle: number,
): { x: number; y: number }[] {
  return points.map((point) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const angleRad = (angle * Math.PI) / 180;
    const nx = center.x + Math.cos(angleRad) * dx - Math.sin(angleRad) * dy;
    const ny = center.y + Math.sin(angleRad) * dx + Math.cos(angleRad) * dy;
    return {
      x: nx,
      y: ny,
    };
  });
}

export function scalePoints(
  points: { x: number; y: number }[],
  scale: number,
  minX: number,
  minY: number,
  width: number,
  calcHeight: number,
) {
  points.forEach((point) => {
    point.x = (point.x + Math.abs(minX)) / scale + width / 20;
    point.y = (point.y + Math.abs(minY)) / scale + width / 20 - 8;
    point.y = calcHeight - point.y;
  });
}

export function drawPath(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  deviceWidth: number,
  color: string,
  close = false,
) {
  ctx.beginPath();

  ctx.moveTo(points[0].x, points[0].y);

  for (var i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  // curve through the last two points
  ctx.quadraticCurveTo(
    points[i].x,
    points[i].y,
    points[i + 1].x,
    points[i + 1].y,
  );

  ctx.lineWidth = 2 * deviceWidth;
  ctx.strokeStyle = color;

  close && ctx.closePath();

  ctx.lineJoin = "round";
  ctx.stroke();
}
