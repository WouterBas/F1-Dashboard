import { store } from "@/store";
import { SessionGp, TimgingData } from "@/types";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";
import useSWR from "swr";

const LeaderBoard = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const { time, setDriverList, driverList } = store();

  // load timing data
  const { data: timingData } = useSWR<TimgingData[]>(
    `timingdata/${sessionInfo.sessionKey}`,
    fetcher,
  );

  useEffect(() => {
    if (timingData) {
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
    }
  }, [timingData, sessionInfo, time, setDriverList]);

  return (
    <div className="rounded-lg bg-neutral-800 px-2 py-1 font-mono text-xs tracking-wider text-white sm:text-sm md:px-3 md:py-2 md:text-base  lg:px-4 lg:text-lg">
      <ul className="divide-y divide-gray-500">
        {driverList.map((driver) => (
          <li
            key={driver.racingNumber}
            className="flex h-4 items-center justify-end sm:h-5 md:h-6 lg:h-7"
          >
            <span className="m mr-1 w-1/2 justify-self-center text-right  md:mr-1.5 md:w-1/3 lg:mr-2">
              {driver.retired ? "R" : driver.position}
            </span>
            <div
              className="h-4/5 w-1 bg-white/50"
              style={{ backgroundColor: driver.teamColor }}
            ></div>
            <span className=" pl-1 md:pl-1.5 lg:pl-2">
              {driver.abbreviation}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
