import { drawCircuit } from "@/utils/drawCircuit";
import fetcher from "@/utils/fetcher";
import { CircuitPoints, DriverPosition, SessionGp } from "@/types";
import { RefObject, useEffect, useRef } from "react";
import useSWR from "swr";
import MediaControls from "./MediaControls";
import { store } from "@/store";

const Map = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const { time, setTime, isPlaying } = store();
  const ref: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

  const { data: circuitPoints } = useSWR<CircuitPoints[]>(
    `circuit/points/${sessionInfo.circuitKey}`,
    fetcher,
  );

  const { data: driverPositoins } = useSWR<DriverPosition[]>(
    `position/${sessionInfo.sessionKey}?time=${sessionInfo.startDate}`,
    fetcher,
  );

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0 && driverPositoins) {
      let animationFrameId: number;
      let index = 0;

      // find position closet to current time
      if (driverPositoins.length > 0) {
        const closestPosition = driverPositoins.reduce((a, b) => {
          return Math.abs(
            new Date(time).getTime() - new Date(a.timestamp).getTime(),
          ) <
            Math.abs(new Date(time).getTime() - new Date(b.timestamp).getTime())
            ? a
            : b;
        });
        index = driverPositoins.indexOf(closestPosition);
      }
      const render = () => {
        drawCircuit(
          ref,
          circuitPoints,
          true,
          false,
          driverPositoins[index].entries,
          sessionInfo.drivers,
          index,
        );
        animationFrameId = window.requestAnimationFrame(render);
        setTime(new Date());
      };

      if (isPlaying) {
        render();
      }

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }
  }, [circuitPoints, driverPositoins, sessionInfo, isPlaying, time]);

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
