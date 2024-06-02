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

  console.log(time);

  const { data: driverPositoins } = useSWR<DriverPosition[]>(
    `position/${sessionInfo.sessionKey}?time=${sessionInfo.startDate}`,
    fetcher,
  );

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0 && driverPositoins) {
      let animationFrameId: number = 0;
      const startTime = performance.now();
      let index = 0;
      let frameCount = 0;
      let prevTime: number;
      let numberOfPositions = 1;
      let elapsedTime = 15;

      const render = (now: number) => {
        const timeDifference =
          performance.now() - new Date(startTime).getTime();

        const newTime = new Date(new Date(time).getTime() + timeDifference);

        setTime(newTime);

        // find the position that is closest to newTime but also before it
        const closestPosition = driverPositoins.reduce((acc, current) => {
          const currentTime = new Date(current.timestamp).getTime();
          if (
            currentTime < newTime.getTime() &&
            currentTime > new Date(acc.timestamp).getTime()
          ) {
            return current;
          }
          return acc;
        });
        index = driverPositoins.indexOf(closestPosition);

        // duration is the ms between the last position and the next
        const duration =
          new Date(driverPositoins[index + 1].timestamp).getTime() -
          new Date(driverPositoins[index].timestamp).getTime();

        // delta is the ms between the last frame and the current frame
        const delta = now - prevTime;
        prevTime = now;
        // when index changes, update numberOfPositions and elapsedTime

        elapsedTime += delta;
        if (index !== numberOfPositions) {
          numberOfPositions = index;
          elapsedTime = 15;
        }

        let progress = elapsedTime / duration;
        if (progress > 1) {
          progress = 1;
        }
        if (!progress) {
          progress = 0;
        }

        const currentEntries = driverPositoins[index].entries;
        const nextEntries = driverPositoins[index + 1].entries;

        const inbetweenPositions: { [key: string]: { X: number; Y: number } } =
          {};

        Object.keys(currentEntries).forEach((key) => {
          inbetweenPositions[key] = {
            X:
              currentEntries[key].X +
              (nextEntries[key].X - currentEntries[key].X) * progress,
            Y:
              currentEntries[key].Y +
              (nextEntries[key].Y - currentEntries[key].Y) * progress,
          };
        });

        frameCount++;
        drawCircuit(
          ref,
          circuitPoints,
          true,
          false,
          inbetweenPositions,
          sessionInfo.drivers,
          frameCount,
          progress,
        );
        animationFrameId = window.requestAnimationFrame(render);
      };

      if (isPlaying) {
        render(performance.now());
      } else {
        render(performance.now());
        window.cancelAnimationFrame(animationFrameId);
      }

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, circuitPoints, driverPositoins]);

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
      <MediaControls sessionInfo={sessionInfo} />
    </div>
  );
};
export default Map;
