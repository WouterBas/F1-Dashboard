import { DriverTimingList, SessionGp } from "@/types";

const DriverList = ({
  driverList,
  sessionInfo,
}: {
  driverList: DriverTimingList[];
  sessionInfo: SessionGp;
}) => {
  return (
    <>
      {driverList.map((driver) => (
        <li
          key={driver.racingNumber}
          className={`${(driver.retired || (driver.stopped && (sessionInfo.type === "Race" || sessionInfo.type === "Sprint"))) && "opacity-30"} flex h-4 items-center justify-end sm:h-5 md:h-6 lg:h-7`}
        >
          <div className="mr-1 flex h-full w-[17px] items-center  justify-center justify-self-center text-center sm:w-[19px] md:mr-1.5 md:w-[21px]  lg:mr-2 lg:w-[23px]">
            {driver.inPit && !driver.retired && !driver.stopped ? (
              <div className="h-4/5 w-full rounded-sm bg-neutral-500  text-[10px] leading-3 sm:text-xs  md:text-sm  lg:text-base">
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
