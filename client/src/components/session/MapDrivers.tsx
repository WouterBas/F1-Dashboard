"use client";
import fetcher from "@/utils/fetcher";
import {
  SortedDriverPosition,
  DriverPosition,
  SessionGp,
  CircuitInfo,
} from "@/types";
import { RefObject, useContext, useLayoutEffect, useRef } from "react";
import useSWR from "swr";
import { drawDrivers } from "@/utils/drawDrivers";
import { FaSpinner } from "react-icons/fa6";
import { useStore } from "zustand";
import { sessionContext } from "@/store/sessionStore";

const MapDrivers = ({
  sessionInfo,
  circuitInfo,
  width,
  dpr,
  scale,
}: {
  sessionInfo: SessionGp;
  circuitInfo: CircuitInfo;
  width: number;
  dpr: number;
  scale: number;
}) => {
  const circuitDriverssRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const store = useContext(sessionContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const {
    time,
    isPlaying,
    driverList,
    minute,
    toggleIsPlaying,
    wasPlaying,
    setWasPlaying,
    showLabels,
    circuitDimensions,
  } = useStore(store);

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
      scale,
      circuitInfo.angle,
      sessionInfo,
      showLabels,
    );
  }, [
    time,
    data,
    circuitDimensions,
    circuitDriverssRef,
    width,
    dpr,
    driverList,
    scale,
    sessionInfo,
    showLabels,
    circuitInfo,
  ]);
  return (
    <>
      {isLoading && !isPlaying && (
        <FaSpinner className="absolute left-[calc(50%-24px)] top-[calc(50%-24px)] z-10 animate-spin text-3xl" />
      )}
      {data && (
        <canvas
          className="absolute top-0 max-h-[calc(100dvh-92px)] max-w-full sm:max-h-[calc(100dvh-122px)] md:max-h-[calc(100dvh-160px)] lg:max-h-[calc(100dvh-186px)]"
          ref={circuitDriverssRef}
          width={circuitDimensions.calcWidth}
          height={circuitDimensions.calcHeight}
        ></canvas>
      )}
    </>
  );
};
export default MapDrivers;
