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
  useState,
} from "react";
import useSWR from "swr";
import { drawDrivers } from "@/utils/drawDrivers";
import { FaSpinner } from "react-icons/fa6";
import { useStore } from "zustand";
import { sessionContext } from "@/store/sessionStore";
import { useDebounce } from "use-debounce";

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
    setPlaying,
    setMinute,
  } = useStore(store);
  const [minute, setLocalMinute] = useState(0);
  const [debouncedMinute] = useDebounce(minute, 250);
  const [noData, setNoData] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);

  // load driver positions
  const { data, isLoading } = useSWR<DriverPosition[]>(
    `position/${sessionInfo.sessionKey}?minute=${debouncedMinute}&starttime=${sessionInfo.startDate}`,
    fetcher,
    {
      keepPreviousData: true,
      onSuccess: () => {
        if (wasPlaying) {
          setPlaying(true);
          setWasPlaying(false);
        }
      },
    },
  );

  useEffect(() => {
    setMinute(debouncedMinute);
  }, [debouncedMinute, setMinute]);

  useEffect(() => {
    // set the minute
    const newMitute = Math.floor(
      (time.getTime() - new Date(sessionInfo.startDate).getTime()) / 1000 / 60,
    );
    setLocalMinute(newMitute < 0 ? 0 : newMitute);

    // no data available for current time
    const found = data?.find((item) => {
      const timestamp = new Date(item.timestamp).getTime();
      return (
        timestamp > time.getTime() - 1000 && timestamp < time.getTime() + 1000
      );
    });
    setNoData(found ? true : false);
    if (!found) {
      isPlaying && setWasPlaying(true);
      setPlaying(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

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
      if (!nextEntries[i]) return entry;
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
      {isLoading && !noData && (
        <FaSpinner className="absolute left-[calc(50%-12px)] top-[calc(50%-12px)] z-10 animate-spin text-3xl" />
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
