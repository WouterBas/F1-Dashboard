import { CircuitDimensions, SessionGp, SortedDriverPosition } from "@/types";
import { RefObject } from "react";

export function drawDrivers(
  ref: RefObject<HTMLCanvasElement>,
  drivers: SortedDriverPosition[],
  { calcWidth, calcHeight, scale, minX, minY }: CircuitDimensions,
  width: number,
  dpr: number,
  deviceWidth: number,
  sessionInfo: SessionGp,
  showLabels: boolean,
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
      Y: (driver.Y + Math.abs(minY)) / scale + width / 15,
    };
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
            X,
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
            X + 1 * deviceWidth,
            Y - 5 * deviceWidth,
          );
        }
      },
    );
  }
}
