import {
  driverList,
  Position,
  driverPosition,
  SessionGp,
} from "@/types/defentions";
import { useState, useEffect } from "react";
import { remap } from "@/app/utils/helpers";

const MapDrivers = ({
  drivers,
  size,
  sessionInfo,
  time,
}: {
  drivers: driverList[];
  size: { width: number; height: number };
  sessionInfo: SessionGp;
  time: Date;
}) => {
  const { minX, minY, maxY } = sessionInfo.circuitInfo;
  const [postions, setPostions] = useState<Position[]>([]);
  const [driversPostions, setDriversPostions] = useState<driverPosition[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position>(postions[0]);
  const [delay, setDelay] = useState(270);

  useEffect(() => {
    (async () => {
      const respone = await fetch(
        `http://localhost:4000/position/${sessionInfo.sessionKey}?time=${sessionInfo.startDate}`,
      );
      const data: Position[] = await respone.json();
      setPostions(data);
    })();
  }, [sessionInfo]);

  useEffect(() => {
    if (postions.length != 0) {
      const goal = time.getTime();
      const output: Position = postions.reduce((prev, curr) =>
        Math.abs(new Date(curr.timestamp).getTime() - time.getTime()) <
        Math.abs(new Date(prev.timestamp).getTime() - time.getTime())
          ? curr
          : prev,
      );
      if (currentPosition != output) {
        const diff =
          new Date(output?.timestamp).getTime() -
          new Date(currentPosition?.timestamp).getTime();
        setCurrentPosition(output);
        setDelay(diff);
      }
    }
  }, [currentPosition, postions, time]);

  console.log(currentPosition);

  useEffect(() => {
    if (postions.length != 0) {
      setDriversPostions(
        drivers.map((driver) => {
          return {
            ...driver,
            x: remap(
              size.height,
              currentPosition?.entries[driver.racingNumber]?.X,
              minX,
              maxY,
            ),
            y: remap(
              size.height,
              currentPosition?.entries[driver.racingNumber]?.Y,
              minY,
              maxY,
            ),
            z: currentPosition?.entries[driver.racingNumber]?.Z,
          };
        }),
      );
    }
  }, [postions, drivers, size, minX, minY, maxY, currentPosition]);

  return (
    <>
      {driversPostions && (
        <ul>
          {driversPostions.map((driver) => (
            <li
              key={driver.racingNumber}
              className="absolute left-[-10px] top-[-10px] grid transform-gpu font-mono font-semibold tracking-wider ease-linear"
              style={{
                transform: `translate(${driver.x}px, ${driver.y}px)`,
                // zIndex: driver.pos,
                display: driver.z ? "block" : "none",
                transition: `transform ${delay}ms linear`,
              }}
            >
              <div
                className="h-2 w-2 rounded-full bg-white/50 "
                style={{
                  backgroundColor: `${"#" + driver.teamColor}`,
                  // zIndex: driver.pos,
                }}
              ></div>

              <span
                className=" absolute top-[-25px] rounded-sm bg-neutral-800/50 px-1 backdrop-blur-[1px] "
                // style={{ zIndex: driver.pos + 20 }}
              >
                {driver.abbreviation}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
export default MapDrivers;
