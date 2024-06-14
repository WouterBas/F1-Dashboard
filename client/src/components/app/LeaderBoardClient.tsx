"use client";
import { useAppStore } from "@/store/appStore";
import { SessionGp, TimgingData } from "@/types";
import { useEffect } from "react";
import DriverList from "@/components/app/DriverList";
import DriverListLoading from "@/components/app/DriverListLoading";

const LeaderBoardClient = ({
  timingData,
  sessionInfo,
}: {
  timingData: TimgingData[];
  sessionInfo: SessionGp;
}) => {
  const { time, setDriverList, driverList } = useAppStore();

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
    <div className="rounded-md bg-neutral-800 p-1 font-mono text-xs tracking-wider text-white sm:p-2 sm:text-sm md:px-3 md:text-base lg:text-lg">
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
