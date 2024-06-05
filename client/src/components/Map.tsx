"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import fetcher from "@/utils/fetcher";
import {
  CircuitDimensions,
  CircuitPoints,
  DriverPosition,
  SessionGp,
} from "@/types";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { store } from "@/store";
import { drawDrivers } from "@/utils/drawDrivers";
import MediaControls from "./MediaControls";

const Map = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const circuitDriverssRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const { time, setTime, isPlaying } = store();
  const [circuitDimensions, setCircuitDimensions] =
    useState<CircuitDimensions>();
  const dpr = window.devicePixelRatio;

  // load circuit points
  const { data: circuitPoints } = useSWR<CircuitPoints[]>(
    `circuit/points/${sessionInfo.circuitKey}`,
    fetcher,
  );

  // load driver positions
  const { data, setSize } = useSWRInfinite<DriverPosition[]>(
    (index) =>
      `position/${sessionInfo.sessionKey}?minute=${index}&starttime=${sessionInfo.startDate}`,
    fetcher,
  );

  // set width
  useEffect(() => {
    window.addEventListener("resize", () => {
      mainRef.current && setWidth(mainRef.current.clientWidth);
    });
    mainRef.current && setWidth(mainRef.current.clientWidth);
  }, [circuitRef, circuitPoints]);

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0) {
      const circuitDim = drawCircuit(
        circuitRef,
        circuitPoints,
        true,
        false,
        width,
        dpr,
      );
      setCircuitDimensions(circuitDim);
    }
  }, [circuitPoints, circuitRef, width, dpr]);

  // Render the Drivers
  useLayoutEffect(() => {
    if (!data || !circuitDimensions) return;
    // find the position that is closest to newTime but also before it
    const driverPositoins = data.flat();
    const closestPosition = driverPositoins.reduce((acc, current) => {
      const currentTime = new Date(current.timestamp).getTime();
      if (
        currentTime < time.getTime() &&
        currentTime > new Date(acc.timestamp).getTime()
      ) {
        return current;
      }

      return acc;
    });
    const index = driverPositoins.indexOf(closestPosition);

    // duration is the ms between the last position and the next
    const duration =
      new Date(driverPositoins[index + 1].timestamp).getTime() -
      new Date(driverPositoins[index].timestamp).getTime();

    let progress =
      (time.getTime() - new Date(closestPosition.timestamp).getTime()) /
      duration;

    const currentEntries = driverPositoins[index].entries;
    const nextEntries = driverPositoins[index + 1].entries;

    const inbetweenPositions: { [key: string]: { X: number; Y: number } } = {};
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

    drawDrivers(
      circuitDriverssRef,
      inbetweenPositions,
      sessionInfo.drivers,
      circuitDimensions,
      width,
      dpr,
    );
  }, [
    time,
    data,
    circuitDimensions,
    circuitDriverssRef,
    width,
    dpr,
    sessionInfo.drivers,
  ]);

  useLayoutEffect(() => {
    if (isPlaying) {
      let animationFrameId: number;
      const startTime = performance.now();
      let armed = false;

      const render = () => {
        const timeDifference =
          performance.now() - new Date(startTime).getTime();
        const newTime = new Date(new Date(time).getTime() + timeDifference);
        setTime(newTime);

        // load more data if needed
        if (newTime.getSeconds() === 1 && !armed) {
          armed = true;
          setSize((previousSize) => previousSize + 1);
        }
        if (newTime.getSeconds() === 2 && armed) {
          armed = false;
        }

        animationFrameId = requestAnimationFrame(render);
      };
      animationFrameId = requestAnimationFrame(render);
      return () => cancelAnimationFrame(animationFrameId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div
      className="relative rounded-lg bg-neutral-800 p-2 sm:p-3 md:p-4"
      ref={mainRef}
    >
      <div className="relative mx-auto w-full max-w-fit">
        {circuitPoints && (
          <>
            <canvas
              className="mx-auto max-h-[calc(100dvh-136px)] max-w-full"
              ref={circuitRef}
            ></canvas>
            <canvas
              className="absolute top-0 mx-auto max-h-[calc(100dvh-136px)] max-w-full"
              ref={circuitDriverssRef}
              style={{ imageRendering: "crisp-edges" }}
            ></canvas>
          </>
        )}
      </div>

      <MediaControls sessionInfo={sessionInfo} />
    </div>
  );
};
export default Map;
