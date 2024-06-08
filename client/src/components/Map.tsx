"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import fetcher from "@/utils/fetcher";
import {
  CircuitDimensions,
  CircuitPoints,
  SortedDriverPosition,
  DriverPosition,
  SessionGp,
} from "@/types";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import useSWR from "swr";
import { store } from "@/store";
import { drawDrivers } from "@/utils/drawDrivers";
import MediaControls from "./MediaControls";
import { FaSpinner } from "react-icons/fa6";

const Map = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const circuitDriverssRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const {
    time,
    setTime,
    isPlaying,
    driverList,
    minute,
    setMinute,
    toggleIsPlaying,
    wasPlaying,
    setWasPlaying,
  } = store();
  const [circuitDimensions, setCircuitDimensions] =
    useState<CircuitDimensions>();
  const dpr = window.devicePixelRatio;

  // load circuit points
  const { data: circuitPoints } = useSWR<CircuitPoints[]>(
    `circuit/points/${sessionInfo.circuitKey}`,
    fetcher,
  );

  // load driver positions
  const { data, isLoading } = useSWR<DriverPosition[]>(
    `position/${sessionInfo.sessionKey}?minute=${minute}&starttime=${sessionInfo.startDate}`,
    fetcher,
    {
      keepPreviousData: true,
      onSuccess: () => {
        if (!isPlaying && wasPlaying) {
          toggleIsPlaying();
          setWasPlaying(false);
        }
      },
    },
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
    if (!driverPositoins.length) return;

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

    if (driverPositoins[index + 1] === undefined) return;

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

    // sort inbetweenPositions based on positions in driverList
    const sortedDriverList: SortedDriverPosition[] = driverList
      .map((driver) => {
        return {
          racingNumber: driver.racingNumber,
          abbreviation: driver.abbreviation,
          teamColor: driver.teamColor,
          X: inbetweenPositions[driver.racingNumber].X,
          Y: inbetweenPositions[driver.racingNumber].Y,
        };
      })
      .reverse();

    drawDrivers(
      circuitDriverssRef,
      sortedDriverList,
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
    driverList,
  ]);

  useLayoutEffect(() => {
    if (isPlaying) {
      let animationFrameId: number;
      const startTime = performance.now();

      const render = () => {
        const timeDifference =
          performance.now() - new Date(startTime).getTime();
        const newTime = new Date(new Date(time).getTime() + timeDifference);
        setTime(newTime);

        const minute = Math.floor(
          (newTime.getTime() - new Date(sessionInfo.startDate).getTime()) /
            1000 /
            60,
        );

        setMinute(minute);

        animationFrameId = requestAnimationFrame(render);
      };
      animationFrameId = requestAnimationFrame(render);
      return () => cancelAnimationFrame(animationFrameId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div
      className="relative rounded-lg  bg-neutral-800 p-2 sm:p-3 md:p-4"
      ref={mainRef}
    >
      {isLoading && !isPlaying && (
        <FaSpinner className="absolute left-[calc(50%-24px)] top-[calc(50%-24px)] z-10 animate-spin  text-3xl" />
      )}
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
