import { CircuitDimensions, SortedDriverPosition } from "@/types";
import { RefObject } from "react";

export function drawDrivers(
  ref: RefObject<HTMLCanvasElement>,
  drivers: SortedDriverPosition[],
  { calcWidth, calcHeight, scale, minX, minY }: CircuitDimensions,
  width: number,
  dpr: number,
) {
  const canvas = ref.current as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.canvas.height = calcHeight * dpr;
  ctx.canvas.width = calcWidth * dpr;

  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // scale driver positions
  const driverPositions: SortedDriverPosition[] = drivers.map((driver) => {
    return {
      ...driver,
      X: (driver.X + Math.abs(minX)) / scale + width / 20,
      Y: (driver.Y + Math.abs(minY)) / scale + width / 20,
    };
  });

  if (driverPositions.length > 0) {
    driverPositions.forEach(({ abbreviation, teamColor, X, Y, retired }) => {
      ctx.globalAlpha = retired ? 0.5 : 1;

      ctx.beginPath();
      ctx.globalAlpha = retired ? 0.5 : 1;

      ctx.arc(X, Y, width / 125, 0, 2 * Math.PI, false);
      ctx.fillStyle = teamColor ? teamColor : "white";

      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(X, Y - 33, 42, 22, 4);
      ctx.fillStyle = "rgba(50, 50, 50, 0.85)";
      ctx.fill();

      ctx.font = "18px monospace";
      ctx.fillStyle = "white";
      ctx.fillText(abbreviation ? abbreviation : "", X + 5, Y - 16);
    });
  }
}
