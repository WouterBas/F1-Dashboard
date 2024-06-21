"use client";
import { AppContext } from "@/store/appStore";
import { SessionGp, TimgingData } from "@/types";
import { useContext, useEffect } from "react";
import DriverList from "@/components/app/DriverList";
import { useStore } from "zustand";

const LeaderBoard = ({
  timingData,
  sessionInfo,
}: {
  timingData: TimgingData[];
  sessionInfo: SessionGp;
}) => {
  const store = useContext(AppContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const { time, driverList, setDriverList } = useStore(store, (s) => s);

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
    const index = timingData.indexOf(closestTiming);

    // create new driver list
    const newDriverList = sessionInfo.drivers
      .map((driver) => {
        const driverTiming = timingData[index].lines[driver.racingNumber];
        return {
          racingNumber: driver.racingNumber,
          teamColor: driver.teamColor,
          abbreviation: driver.abbreviation,
          inPit: driverTiming.inPit,
          pitOut: driverTiming.pitOut,
          retired: driverTiming.retired,
          position: driverTiming.position,
          stopped: driverTiming.stopped,
        };
      })
      .sort((a, b) => a.position - b.position);
    setDriverList(newDriverList);
  }, [timingData, sessionInfo, time, setDriverList]);

  return (
    <div className="rounded-md bg-neutral-800 p-1 font-mono text-xs tracking-wider text-white sm:p-2 sm:text-sm md:px-3 md:text-base lg:text-lg">
      <ul className="divide-y divide-gray-500">
        <DriverList driverList={driverList} sessionInfo={sessionInfo} />
      </ul>
    </div>
  );
};

export default LeaderBoard;
