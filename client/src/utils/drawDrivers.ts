import { CircuitDimensions, driverList } from "@/types";
import { RefObject } from "react";

export function drawDrivers(
  ref: RefObject<HTMLCanvasElement>,
  positions: { [key: string]: { X: number; Y: number } } = {},
  drivers: driverList[] = [],
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
  const driverPositions: { [key: string]: { X: number; Y: number } } =
    Object.keys(positions).length > 0
      ? Object.keys(positions).reduce((acc, key) => {
          return {
            ...acc,
            [key]: {
              X: (positions[key].X + Math.abs(minX)) / scale + width / 20,
              Y: (positions[key].Y + Math.abs(minY)) / scale + width / 20,
            },
          };
        }, {})
      : {};

  // draw driver positions with team colors and label with abbreviation
  if (driverPositions) {
    Object.keys(driverPositions).forEach((key) => {
      ctx.beginPath();
      ctx.arc(
        driverPositions[key].X,
        driverPositions[key].Y,
        width / 125,
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
        driverPositions[key].Y - 33,
        42,
        22,
        4,
      );
      ctx.fillStyle = "rgba(50, 50, 50, 0.85)";
      ctx.fill();

      // label with abbreviation
      ctx.font = "18px monospace";
      ctx.fillStyle = "white";

      ctx.fillText(
        drivers.find((driver) => driver.racingNumber === parseInt(key))
          ?.abbreviation ?? "", // Provide a default value if abbreviation is undefined
        driverPositions[key].X + 5,
        driverPositions[key].Y - 16,
      );
    });
  }
}
