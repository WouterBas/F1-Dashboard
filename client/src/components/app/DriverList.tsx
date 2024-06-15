import { DriverTimingList } from "@/types";

const DriverList = ({ driverList }: { driverList: DriverTimingList[] }) => {
  return (
    <>
      {driverList.map((driver) => (
        <li
          key={driver.racingNumber}
          className={`${(driver.retired || driver.stopped) && "opacity-30"} flex h-4 items-center justify-end sm:h-5 md:h-6 lg:h-7`}
        >
          <div className="mr-1 flex h-full w-1/2 items-center justify-center justify-self-center text-right md:mr-1.5 md:w-1/3 lg:mr-2">
            {driver.inPit && !driver.retired && !driver.stopped ? (
              <div className="h-4/5 w-[17px] rounded-sm bg-neutral-500 text-center text-[10px] leading-3 sm:w-5 sm:text-xs md:w-[21px] md:text-sm lg:w-6 lg:text-base">
                P
              </div>
            ) : (
              driver.position
            )}
          </div>
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
