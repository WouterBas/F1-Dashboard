import { DriverTimingList } from "@/types";

const DriverList = ({ driverList }: { driverList: DriverTimingList[] }) => {
  return (
    <>
      {driverList.map((driver) => (
        <li
          key={driver.racingNumber}
          className={`${(driver.retired || driver.stopped) && "opacity-30"} flex h-4 items-center justify-end sm:h-5 md:h-6 lg:h-7`}
        >
          <p className="m mr-1 w-1/2 justify-self-center text-right  md:mr-1.5 md:w-1/3 lg:mr-2">
            {driver.inPit && !driver.retired && !driver.stopped ? (
              <span className=" rounded-sm bg-neutral-500 px-1">P</span>
            ) : (
              driver.position
            )}
          </p>
          <div
            className="h-4/5 w-1 bg-white/50"
            style={{ backgroundColor: driver.teamColor }}
          ></div>
          <span className={` pl-1 md:pl-1.5 lg:pl-2`}>
            {driver.abbreviation}
          </span>
        </li>
      ))}
    </>
  );
};
export default DriverList;
