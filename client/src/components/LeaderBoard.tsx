import { driverList } from "@/types";

const LeaderBoard = ({ drivers }: { drivers: driverList[] }) => {
  return (
    <div className="rounded-lg bg-neutral-800 px-2 py-1 font-mono text-xs tracking-wider text-white sm:text-sm md:px-3 md:py-2 md:text-base  lg:px-4 lg:text-lg">
      <ul className="divide-y divide-gray-500">
        {drivers.map((driver) => (
          <li
            key={driver.racingNumber}
            className="flex h-4 items-center justify-end sm:h-5 md:h-6 lg:h-7"
          >
            <span className="m mr-1 w-1/2 justify-self-center text-center md:mr-1.5 md:w-1/3 lg:mr-2">
              00
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
