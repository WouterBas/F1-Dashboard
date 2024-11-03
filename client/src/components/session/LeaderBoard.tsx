"use client";
import { sessionContext } from "@/store/sessionStore";
import { LapCount, SessionGp, TimgingData, TireStints } from "@/types";
import { useContext, useEffect, useState } from "react";
import DriverList from "@/components/session/DriverList";
import { useStore } from "zustand";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

const LeaderBoard = ({
  sessionInfo,
  lapCount,
  tireStints,
}: {
  sessionInfo: SessionGp;
  lapCount: LapCount[];
  tireStints: TireStints[];
}) => {
  const store = useContext(sessionContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const { time, driverList, setDriverList } = useStore(store);
  const [lap, setLap] = useState(1);

  // load driver positions
  const { data: timingData, isLoading } = useSWR<TimgingData>(
    `position/${sessionInfo.sessionKey}?minute=${debouncedMinute}&starttime=${sessionInfo.startDate}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    // find index of closest timing data based on current time
    const closestTiming = timingData.reduce((prev, curr) => {
      const currentTime = new Date(curr.timestamp).getTime();
      if (
        currentTime < time.getTime() &&
        currentTime > new Date(prev.timestamp).getTime()
      ) {
        return curr;
      }
      return prev;
    });
    const closestTireStints = tireStints.reduce((prev, curr) => {
      const currentTime = new Date(curr.timestamp).getTime();
      if (
        currentTime < time.getTime() &&
        currentTime > new Date(prev.timestamp).getTime()
      ) {
        return curr;
      }
      return prev;
    });

    const newDriverList = driverList
      .map((driver) => {
        const matchDriver = closestTiming.lines.find(
          (data) => data.driverNumber === driver.racingNumber,
        );
        const matchTireStints = closestTireStints.lines.find(
          (data) => data.driverNumber === driver.racingNumber,
        );
        return {
          ...driver,
          ...matchDriver,
          ...matchTireStints,
        };
      })
      .sort((a, b) => a.position - b.position);
    setDriverList(newDriverList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timingData, sessionInfo, time, tireStints]);

  useEffect(() => {
    if (lapCount.length === 0) return;
    // find index of closest lap based on current time
    const closestLap = lapCount.reduce((prev, curr) => {
      const currentTime = new Date(curr.timestamp).getTime();
      if (
        currentTime < time.getTime() &&
        currentTime > new Date(prev.timestamp).getTime()
      ) {
        return curr;
      }
      return prev;
    });

    setLap(closestLap.lap);
  }, [lapCount, time]);

  return (
    <div className="w-fit rounded-md bg-neutral-800">
      {lapCount.length > 0 && (
        <p className="w-auto rounded-t-md border-neutral-300  bg-neutral-700 text-center text-sm font-bold sm:text-base md:text-lg lg:py-0.5 lg:text-xl">
          {sessionInfo.type === "Race" || sessionInfo.type === "Sprint"
            ? `${lap}/${lapCount.length}`
            : `Q${lap}`}
        </p>
      )}

      <ul className="divide-y divide-gray-500 p-1 font-mono text-xs tracking-wider text-white sm:p-2 sm:text-sm md:px-3 md:text-base lg:text-lg">
        <DriverList driverList={driverList} sessionInfo={sessionInfo} />
      </ul>
    </div>
  );
};

export default LeaderBoard;
