"use client";
import fetcher from "@/utils/fetcher";
import {
  SortedDriverPosition,
  DriverPosition,
  SessionGp,
  CircuitDimensions,
} from "@/types";
import { RefObject, useLayoutEffect, useRef } from "react";
import useSWR from "swr";
import { useAppStore } from "@/store/appStore";
import { drawDrivers } from "@/utils/drawDrivers";
import { FaSpinner } from "react-icons/fa6";

const MapDrivers = ({
  sessionInfo,
  circuitDimensions,
  width,
  dpr,
  deviceWidth,
}: {
  sessionInfo: SessionGp;
  circuitDimensions: CircuitDimensions;
  width: number;
  dpr: number;
  deviceWidth: number;
}) => {
  const circuitDriverssRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
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
    speed,
  } = useAppStore();

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
          X: inbetweenPositions[driver.racingNumber].X || 0,
          Y: inbetweenPositions[driver.racingNumber].Y || 0,
          retired: driver.retired,
          stopped: driver.stopped,
        };
      })
      .reverse()
      .filter((driver) => {
        return driver.X !== 0 && driver.Y !== 0;
      });

    drawDrivers(
      circuitDriverssRef,
      sortedDriverList,
      circuitDimensions,
      width,
      dpr,
      deviceWidth,
      sessionInfo,
    );
  }, [
    time,
    data,
    circuitDimensions,
    circuitDriverssRef,
    width,
    dpr,
    driverList,
    deviceWidth,
    sessionInfo,
  ]);

  // main clock animation
  useLayoutEffect(() => {
    if (isPlaying) {
      let animationFrameId: number;
      const startTime = performance.now();

      const render = () => {
        const timeDifference =
          performance.now() - new Date(startTime).getTime();
        const newTime = new Date(
          new Date(time).getTime() + timeDifference * speed,
        );

        if (newTime > new Date(sessionInfo.endDate)) {
          toggleIsPlaying();
          return () => cancelAnimationFrame(animationFrameId);
        }
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
    <>
      {isLoading && !isPlaying && circuitDimensions.calcWidth && (
        <FaSpinner className="absolute left-[calc(50%-24px)] top-[calc(50%-24px)] z-10 animate-spin text-3xl" />
      )}
      <canvas
        className="absolute top-0 mx-auto max-h-[calc(100dvh-82px)] max-w-full"
        ref={circuitDriverssRef}
      ></canvas>
    </>
  );
};
export default MapDrivers;
