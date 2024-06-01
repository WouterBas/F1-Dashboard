import { CircuitPoints, driverList } from "@/types";
import { RefObject } from "react";

export function drawCircuit(
  ref: RefObject<HTMLCanvasElement>,
  circuitPoints: CircuitPoints[],
  close: boolean,
  drawPoints: boolean,
  positions: { [key: string]: { X: number; Y: number } } = {},
  drivers: driverList[] = [],
  frameCount: number = 0,
) {
  const minX = Math.min(...circuitPoints.map((loc) => loc.x));
  const minY = Math.min(...circuitPoints.map((loc) => loc.y));
  const maxX = Math.max(...circuitPoints.map((loc) => loc.x)) + Math.abs(minX);
  const maxY = Math.max(...circuitPoints.map((loc) => loc.y)) + Math.abs(minY);

  const aspectRatio = maxX / maxY;
  const scale = maxY / (2048 - 100);

  // scale points
  const points = circuitPoints.map((loc) => {
    return {
      x: (loc.x + Math.abs(minX)) / scale + 50,
      y: (loc.y + Math.abs(minY)) / scale + 50,
    };
  });

  // scale driver positions
  const driverPositions: { [key: string]: { X: number; Y: number } } =
    Object.keys(positions).length > 0
      ? Object.keys(positions).reduce((acc, key) => {
          return {
            ...acc,
            [key]: {
              X: (positions[key].X + Math.abs(minX)) / scale + 50,
              Y: (positions[key].Y + Math.abs(minY)) / scale + 50,
            },
          };
        }, {})
      : {};

  const canvas = ref.current as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.canvas.height = 2048;
  ctx.canvas.width = 2048 * aspectRatio + 100;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.beginPath();
  ctx.fillStyle = "whitesmoke";
  ctx.arc(50, 50, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
  ctx.fill();

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

  // draw driver positions with team colors and label with abbreviation
  if (driverPositions) {
    Object.keys(driverPositions).forEach((key) => {
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.arc(
        driverPositions[key].X,
        driverPositions[key].Y,
        25,
        0,
        2 * Math.PI,
        false,
      );
      ctx.fillStyle = `${drivers.find((driver) => driver.racingNumber === parseInt(key))?.teamColor}`;
      ctx.fill();

      // label background
      ctx.beginPath();
      ctx.roundRect(
        driverPositions[key].X,
        driverPositions[key].Y - 80,
        110,
        55,
        10,
      );
      ctx.fillStyle = "rgba(50, 50, 50, 0.85)";
      ctx.fill();

      // clear the shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0)";

      // label with abbreviation
      ctx.font = "48px monospace ";
      ctx.fillStyle = "white";

      ctx.fillText(
        drivers.find((driver) => driver.racingNumber === parseInt(key))
          ?.abbreviation ?? "", // Provide a default value if abbreviation is undefined
        driverPositions[key].X + 10,
        driverPositions[key].Y - 35,
      );
    });
  }

  if (drawPoints) {
    points.forEach((point, i, arr) => {
      ctx.beginPath();

      // first point green
      if (i === 0) {
        ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(52, 211, 153, 0.25)";
        ctx.strokeStyle = "rgb(52, 211, 153)";
        // last point red
      } else if (i === arr.length - 1) {
        ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
        ctx.strokeStyle = "rgb(239, 68, 68)";
        // middle points blue
      } else {
        ctx.arc(point.x, point.y, 16, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(96, 165, 250, 0.25)";
        ctx.strokeStyle = "rgb(96, 165, 250)";
      }

      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();
    });
  }
}
