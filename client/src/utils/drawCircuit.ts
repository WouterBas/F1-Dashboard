import { CircuitPoints } from "@/types";
import { RefObject } from "react";
import { circuitSize } from "@/utils/helpers";

export function drawCircuit(
  ref: RefObject<HTMLCanvasElement>,
  circuitPoints: CircuitPoints[],
  close: boolean,
  drawPoints: boolean,
  width: number,
  dpr: number,
) {
  const minX = Math.min(...circuitPoints.map((loc) => loc.x));
  const minY = Math.min(...circuitPoints.map((loc) => loc.y));
  const maxX = Math.max(...circuitPoints.map((loc) => loc.x)) + Math.abs(minX);
  const maxY = Math.max(...circuitPoints.map((loc) => loc.y)) + Math.abs(minY);

  const canvas = ref.current as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const { scale, calcHeight, calcWidth } = circuitSize(maxX, maxY, width);

  ctx.canvas.height = calcHeight * dpr;
  ctx.canvas.width = calcWidth * dpr;

  ctx.scale(dpr, dpr);

  // scale points
  const points = circuitPoints.map((loc) => {
    return {
      x: (loc.x + Math.abs(minX)) / scale + width / 20,
      y: (loc.y + Math.abs(minY)) / scale + width / 20,
    };
  });

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // move to the first point
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

  ctx.lineWidth = width / 200;
  ctx.strokeStyle = "whitesmoke";
  if (close) {
    ctx.closePath();
  }

  ctx.stroke();

  // draw dots
  if (drawPoints) {
    points.forEach((point, i, arr) => {
      ctx.beginPath();

      // first point green
      if (i === 0) {
        ctx.arc(point.x, point.y, width / 150, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(52, 211, 153, 0.25)";
        ctx.strokeStyle = "rgb(52, 211, 153)";
        // last point red
      } else if (i === arr.length - 1) {
        ctx.arc(point.x, point.y, width / 150, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
        ctx.strokeStyle = "rgb(239, 68, 68)";
        // middle points blue
      } else {
        ctx.arc(point.x, point.y, width / 200, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(96, 165, 250, 0.25)";
        ctx.strokeStyle = "rgb(96, 165, 250)";
      }

      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    });
  }

  return { scale, calcHeight, calcWidth, minX, minY };
}
