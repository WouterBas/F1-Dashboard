"use client";
import fetcher from "@/utils/fetcher";
import {
  SortedDriverPosition,
  DriverPosition,
  SessionGp,
  CircuitInfo,
} from "@/types";
import {
  RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
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
    showLabels,
    circuitDimensions,
    minute,
    setMinute,
  } = useStore(store);

  // load driver positions
  const { data, isLoading } = useSWR<DriverPosition[]>(
    `position/${sessionInfo.sessionKey}?minute=${minute}&starttime=${sessionInfo.startDate}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (isPlaying) {
      setMinute(
        Math.floor(
          (time.getTime() - new Date(sessionInfo.startDate).getTime()) /
            1000 /
            60,
        ),
      );
    }
  }, [isPlaying, sessionInfo.startDate, setMinute, time]);

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

    // progress is the percentage between the last position and the next
    let progress =
      (time.getTime() - new Date(closestPosition.timestamp).getTime()) /
      duration;

    const currentEntries = driverPositoins[index].entries;
    const nextEntries = driverPositoins[index + 1].entries;

    // interpolate between the current and next positions
    const inbetweenPositions = currentEntries.map((entry, i) => {
      return {
        driverNumber: entry.driverNumber,
        X: entry.X + (nextEntries[i].X - entry.X) * progress,
        Y: entry.Y + (nextEntries[i].Y - entry.Y) * progress,
      };
    });

    // sort inbetweenPositions based on positions in driverList
    const sortedDriverList: SortedDriverPosition[] = driverList
      .map((driver) => {
        const match = inbetweenPositions.find(
          (entry) => entry.driverNumber === driver.racingNumber,
        );
        return {
          racingNumber: driver.racingNumber,
          abbreviation: driver.abbreviation,
          teamColor: driver.teamColor,
          X: match?.X || 0,
          Y: match?.Y || 0,
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
