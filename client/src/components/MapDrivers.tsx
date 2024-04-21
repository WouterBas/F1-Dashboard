import {
  driverList,
  Position,
  driverPosition,
  SessionGp,
} from "@/types/defentions";
import { useState, useEffect } from "react";
import { remap } from "@/app/helpers/helpers";

const MapDrivers = ({
  drivers,
  size,
  sessionInfo,
}: {
  drivers: driverList[];
  size: { width: number; height: number };
  sessionInfo: SessionGp;
}) => {
  const [{ minX, minY, maxY }] = sessionInfo.circuitInfo;
  const [postions, setPostions] = useState<Position[]>([]);
  const [driversPostions, setDriversPostions] = useState<driverPosition[]>([]);

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
    setDriversPostions(
      drivers.map((driver) => {
        return {
          ...driver,
          x: remap(
            size.height,
            postions[200]?.entries[driver.racingNumber]?.X,
            minX,
            maxY,
          ),
          y: remap(
            size.height,
            postions[200]?.entries[driver.racingNumber]?.Y,
            minY,
            maxY,
          ),
          z: postions[200]?.entries[driver.racingNumber]?.Z,
        };
      }),
    );
  }, [postions, drivers, size, minX, minY, maxY]);

  return (
    <>
      {driversPostions && (
        <ul>
          {driversPostions.map((driver) => (
            <li
              key={driver.racingNumber}
              className="absolute left-0  top-0 grid font-mono font-semibold tracking-wider transition-transform duration-[270ms] ease-linear"
              style={{
                transform: `translate(${driver.x}px, ${driver.y}px)`,
                // zIndex: driver.pos,
                display: driver.z ? "block" : "none",
              }}
            >
              <div
                className="ml-[-4px] mt-[-4px] h-2 w-2 rounded-full bg-white/50 sm:ml-[-6px] sm:mt-[-6px] sm:h-3 sm:w-3 md:ml-[-8px] md:mt-[-8px] md:h-4 md:w-4"
                style={{
                  backgroundColor: `${"#" + driver.teamColor}`,
                  // zIndex: driver.pos,
                }}
              ></div>

              <span
                className="absolute top-[-19px] rounded-sm bg-neutral-800/50 px-1 text-[10px] backdrop-blur-[1px] sm:top-[-22px] sm:text-xs md:top-[-28px] md:text-sm"
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
