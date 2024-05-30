import { drawCircuit } from "@/utils/drawCircuit";
import fetcher from "@/utils/fetcher";
import { CircuitPoints, DriverPosition, SessionGp } from "@/types";
import { RefObject, useEffect, useRef } from "react";
import useSWR from "swr";
import MediaControls from "./MediaControls";

const Map = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const ref: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

  const { data: circuitPoints } = useSWR<CircuitPoints[]>(
    `circuit/points/${sessionInfo.circuitKey}`,
    fetcher,
  );

  const { data: driverPositoins } = useSWR<DriverPosition[]>(
    `position/${sessionInfo.sessionKey}?time=${sessionInfo.startDate}`,
    fetcher,
  );

  if (driverPositoins) {
    console.log(driverPositoins[200].entries);
  }

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0 && driverPositoins) {
      drawCircuit(
        ref,
        circuitPoints,
        true,
        false,
        driverPositoins[200].entries,
        sessionInfo.drivers,
      );
    }
  }, [circuitPoints, driverPositoins, sessionInfo]);

  return (
    <div className="relative rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
      <div className="relative mx-auto w-fit">
        {circuitPoints && (
          <canvas
            className="mx-auto max-h-[calc(100dvh-170px)] max-w-full"
            ref={ref}
          ></canvas>
        )}
      </div>
      <MediaControls />
    </div>
  );
};
export default Map;
