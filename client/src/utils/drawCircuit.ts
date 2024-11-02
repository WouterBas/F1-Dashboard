import { RefObject } from "react";
import { circuitSize } from "@/utils/helpers";

export function drawCircuit(
  ref: RefObject<HTMLCanvasElement>,
  circuitPoints: { x: number; y: number }[],
  width: number,
  dpr: number,
  deviceWidth: number,
  angle: number,
  close = true,
  finishAngle: number,
  finishPoint?: { x: number; y: number },
  drawPoints?: boolean,
) {
  // rotate points by angle degrees around center
  const center = {
    x: width / 2,
    y: width / 2,
  };
  const points = circuitPoints.map((point) => {
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

  const minX = Math.min(...points.map((loc) => loc.x));
  const minY = Math.min(...points.map((loc) => loc.y));
  const maxX = Math.max(...points.map((loc) => loc.x)) + Math.abs(minX);
  const maxY = Math.max(...points.map((loc) => loc.y)) + Math.abs(minY);

  const canvas = ref.current as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const { scale, calcHeight, calcWidth } = circuitSize(maxX, maxY, width);

  ctx.canvas.height = calcHeight * dpr;
  ctx.canvas.width = calcWidth * dpr;

  ctx.scale(dpr, dpr);

  // scale points
  points.forEach((point) => {
    point.x = (point.x + Math.abs(minX)) / scale + width / 20;
    point.y = (point.y + Math.abs(minY)) / scale + width / 20 - 8;
  });

  // flip points vertically
  points.forEach((point) => {
    point.y = calcHeight - point.y;
  });

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // move to the first point
  ctx.moveTo(points[0].x, points[0].y);
  ctx.beginPath();

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

  ctx.lineWidth = 3 * deviceWidth;
  ctx.strokeStyle = "whitesmoke";
  if (close) {
    ctx.closePath();
  }

  ctx.stroke();

  // draw finish line

  // draw dots
  if (drawPoints) {
    points.forEach((point, i, arr) => {
      ctx.beginPath();
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // first point green
      if (i === 0) {
        ctx.arc(point.x, point.y, 4 * deviceWidth, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(52, 211, 153, 0.25)";
        ctx.strokeStyle = "rgb(52, 211, 153)";
        // last point red
      } else if (i === arr.length - 1) {
        ctx.arc(point.x, point.y, 4 * deviceWidth, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
        ctx.strokeStyle = "rgb(239, 68, 68)";
        // middle points blue
      } else {
        ctx.arc(point.x, point.y, 3 * deviceWidth, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(96, 165, 250, 0.25)";
        ctx.strokeStyle = "rgb(96, 165, 250)";
      }

      ctx.lineWidth = 0.5 * deviceWidth;
      ctx.fill();
      ctx.stroke();
    });
  }

  if (finishPoint) {
    const fx = finishPoint.x - center.x;
    const fy = finishPoint.y - center.y;
    const angleRad = (angle * Math.PI) / 180;
    const fnx = center.x + Math.cos(angleRad) * fx - Math.sin(angleRad) * fy;
    const fny = center.y + Math.sin(angleRad) * fx + Math.cos(angleRad) * fy;

    finishPoint.x = fnx;
    finishPoint.y = fny;

    finishPoint.x = (finishPoint.x + Math.abs(minX)) / scale + width / 20;
    finishPoint.y = (finishPoint.y + Math.abs(minY)) / scale + width / 20 - 8;

    finishPoint.y = calcHeight - finishPoint.y;

    ctx.beginPath();
    ctx.fillStyle = "whitesmoke";
    ctx.translate(finishPoint.x, finishPoint.y);
    ctx.rotate((finishAngle * Math.PI) / 180);
    ctx.rect(-5, -20, 10, 40);
    ctx.fill();
  }

  return { scale, calcHeight, calcWidth, minX, minY };
}
