"use client";
import { store } from "@/store";
import { SessionGp, TimgingData } from "@/types";
import { useEffect } from "react";
import DriverList from "@/components/DriverList";
import DriverListLoading from "@/components/DriverListLoading";

const LeaderBoardClient = ({
  timingData,
  sessionInfo,
}: {
  timingData: TimgingData[];
  sessionInfo: SessionGp;
}) => {
  const { time, setDriverList, driverList } = store();

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
        };
      })
      .sort((a, b) => a.position - b.position);
    setDriverList(newDriverList);
  }, [timingData, sessionInfo, time, setDriverList]);

  return (
    <div className="rounded-lg bg-neutral-800 px-2 py-1 font-mono text-xs tracking-wider text-white sm:text-sm md:px-3 md:py-2 md:text-base  lg:px-4 lg:text-lg">
      <ul className="divide-y divide-gray-500">
        {driverList.length > 0 ? (
          <DriverList driverList={driverList} />
        ) : (
          <DriverListLoading />
        )}
      </ul>
    </div>
  );
};

export default LeaderBoardClient;