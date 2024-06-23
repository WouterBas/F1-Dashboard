import { CircuitDimensions, SessionGp, SortedDriverPosition } from "@/types";
import { RefObject } from "react";

export function drawDrivers(
  ref: RefObject<HTMLCanvasElement>,
  drivers: SortedDriverPosition[],
  { calcWidth, calcHeight, scale, minX, minY }: CircuitDimensions,
  width: number,
  dpr: number,
  deviceWidth: number,
  angle: number,
  sessionInfo: SessionGp,
  showLabels: boolean,
) {
  const canvas = ref.current as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.canvas.height = calcHeight * dpr;
  ctx.canvas.width = calcWidth * dpr;

  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // rotate points by angle degrees around center
  const center = {
    x: width / 2,
    y: width / 2,
  };
  const driverPositions = drivers.map((driver) => {
    const dx = driver.X - center.x;
    const dy = driver.Y - center.y;
    const angleRad = (angle * Math.PI) / 180;
    const nx = center.x + Math.cos(angleRad) * dx - Math.sin(angleRad) * dy;
    const ny = center.y + Math.sin(angleRad) * dx + Math.cos(angleRad) * dy;
    return {
      ...driver,
      X: nx,
      Y: ny,
    };
  });

  // scale driver positions
  driverPositions.forEach((driver) => {
    driver.X = (driver.X + Math.abs(minX)) / scale + width / 20;
    driver.Y = (driver.Y + Math.abs(minY)) / scale + width / 20 - 8;
  });

  // flip points vertically
  driverPositions.forEach((driver) => {
    driver.Y = calcHeight - driver.Y;
  });

  if (driverPositions.length > 0) {
    driverPositions.forEach(
      ({ abbreviation, teamColor, X, Y, retired, stopped }) => {
        ctx.beginPath();
        ctx.globalAlpha =
          retired ||
          (stopped &&
            (sessionInfo.type === "Race" || sessionInfo.type === "Sprint"))
            ? 0.5
            : 1;

        ctx.arc(X, Y, 4 * deviceWidth, 0, 2 * Math.PI, false);
        ctx.fillStyle = teamColor ? teamColor : "white";

        ctx.fill();

        if (showLabels) {
          ctx.beginPath();
          ctx.roundRect(
            X - 6 * deviceWidth,
            Y - 4 * deviceWidth,
            16 * deviceWidth,
            -8 * deviceWidth,
            deviceWidth,
          );
          ctx.fillStyle = "rgba(50, 50, 50, 0.85)";
          ctx.fill();

          ctx.font = `${8 * deviceWidth}px monospace`;
          ctx.fillStyle = "white";
          ctx.fillText(
            abbreviation ? abbreviation : "",
            X - 5 * deviceWidth,
            Y - 5 * deviceWidth,
          );
        }
      },
    );
  }
}
