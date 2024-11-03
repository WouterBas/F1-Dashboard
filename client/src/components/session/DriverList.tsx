import { DriverTimingList, SessionGp } from "@/types";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

const DriverList = ({
  driverList,
  sessionInfo,
}: {
  driverList: DriverTimingList[];
  sessionInfo: SessionGp;
}) => {
  const getBorderColour = (compound: string | undefined) => {
    switch (compound) {
      case "soft":
        return "border-red-600";
      case "medium":
        return "border-amber-400";
      case "hard":
        return "border-neutral-200";
      case "intermediate":
        return "border-green-600";
      case "wet":
        return "border-sky-600";
      default:
        return "border-neutral-500";
    }
  };

  const getBackgroundColour = (compound: string | undefined) => {
    switch (compound) {
      case "soft":
        return "bg-red-600";
      case "medium":
        return "bg-amber-400";
      case "hard":
        return "bg-neutral-200";
      case "intermediate":
        return "bg-green-600";
      case "wet":
        return "bg-sky-600";
      default:
        return "bg-neutral-500";
    }
  };

  return (
    <LayoutGroup key="drivers">
      {driverList.map((driver) => (
        <AnimatePresence key={driver.racingNumber}>
          <motion.li
            layout="position"
            key={driver.racingNumber}
            className={`${(driver.retired || (driver.stopped && (sessionInfo.type === "Race" || sessionInfo.type === "Sprint"))) && "opacity-30"}  flex h-4 justify-end gap-2  sm:h-5 md:h-6 lg:h-7`}
          >
            <p>{driver.position}</p>

            <div
              className="mt-0.5 h-4/5 w-1 bg-white/50"
              style={{ backgroundColor: driver.teamColor }}
            ></div>
            <p className="">{driver.abbreviation}</p>
            <p className=" text-neutral-400 ">__.___</p>

            <div className="flex h-full w-8 items-center sm:w-9 md:w-10 lg:w-12">
              {driver.inPit && !driver.retired && !driver.stopped ? (
                <div className="h-4/5 w-full rounded-sm bg-neutral-500 text-center text-[10px] leading-3 sm:text-xs md:rounded  md:text-sm lg:text-base ">
                  PIT
                </div>
              ) : (
                <>
                  <div
                    className={`${getBorderColour(driver.compound)} relative mr-1 aspect-square w-3 rounded-full border-[3px] md:w-4 `}
                  >
                    <div
                      className={`${getBackgroundColour(driver.compound)} absolute left-1/2 top-1/2 aspect-square w-1 -translate-x-1/2 -translate-y-1/2 rounded-full `}
                    ></div>
                  </div>
                  <p className=" text-center text-neutral-400">{driver.age}</p>
                </>
              )}
            </div>
            <p className="w-4 text-neutral-400 sm:w-5">P{driver.pitStops}</p>
          </motion.li>
        </AnimatePresence>
      ))}
    </LayoutGroup>
  );
};
export default DriverList;
