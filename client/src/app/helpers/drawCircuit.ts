import { CircuitPoints } from "@/types/defentions";
import { RefObject } from "react";

export const drawCircuit = (
  ref: RefObject<HTMLCanvasElement>,
  circuitPoints: CircuitPoints[],
  close = true,
  drawPoints = false,
) => {
  const minX = Math.min(...circuitPoints.map((loc) => loc.x));
  const minY = Math.min(...circuitPoints.map((loc) => loc.y));
  const maxX = Math.max(...circuitPoints.map((loc) => loc.x)) + Math.abs(minX);
  const maxY = Math.max(...circuitPoints.map((loc) => loc.y)) + Math.abs(minY);

  const aspectRatio = maxX / maxY;
  const scale = maxY / (2048 - 50);

  const points = circuitPoints.map((loc) => {
    return {
      x: (loc.x + Math.abs(minX)) / scale + 25,
      y: (loc.y + Math.abs(minY)) / scale + 25,
    };
  });

  const canvas = ref.current as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.canvas.height = 2048;
  ctx.canvas.width = 2048 * aspectRatio + 50;

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

  ctx.lineWidth = 15;
  ctx.strokeStyle = "whitesmoke";
  if (close) {
    ctx.closePath();
  }

  ctx.stroke();

  if (drawPoints) {
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 16, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });
  }
};
